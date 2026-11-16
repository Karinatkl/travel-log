/* 2026 旅行行事曆 — 由 site.data.trips 即時渲染 */
(function () {
  var CFG = window.CAL || {};
  var YEAR = CFG.year || new Date().getFullYear();
  var BASE = (CFG.base || "/").replace(/\/$/, "");
  var TRIPS = (CFG.trips || []).filter(function (t) {
    return t && t.start_date && t.end_date;
  });

  var COLORS = {
    SPORT: "#B45309", DIGITAL_NOMAD: "#0E7490", LEISURE: "#6D28D9",
    BUSINESS: "#334155", FAMILY: "#B23A48", TRANSIT: "#0F766E"
  };
  var ZH = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
  var EN = ["JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE","JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"];
  var WD = ["一","二","三","四","五","六","日"];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function parseD(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function shortTag(t) {
    var name = String(t.title_zh || "").replace(/^\d{4}\.\d{4}-\d{4}\s*/, "");
    name = name.split("（")[0].split("(")[0].trim();
    return name || t.city || t.country || t.trip_id;
  }
  function link(t) { return BASE + "/" + String(t.path || "").replace(/^\/|\/$/g, "") + "/"; }
  function cover(t) { return BASE + "/photos/" + t.id + "/cover.jpg"; }

  /* ── 準備資料 ── */
  var trips = TRIPS.map(function (t) {
    return {
      raw: t, id: t.trip_id, path: t.detail_path || "", title: String(t.title_zh || "").replace(/^\d{4}\.\d{4}-\d{4}\s*/, ""),
      tag: shortTag(t), type: t.trip_type || "", kind: t.trip_type || "",
      color: COLORS[t.trip_type] || "#B5502F",
      start: parseD(t.start_date), end: parseD(t.end_date),
      nights: t.nights || "", with_: String(t.companions || "").replace(/^WITH:/, ""),
      city: t.city || "", country: t.country || ""
    };
  }).filter(function (t) { return t.start.getFullYear() === YEAR || t.end.getFullYear() === YEAR; });

  var DAY = {};
  trips.forEach(function (t) {
    var d = new Date(t.start.getTime());
    while (d <= t.end) { DAY[key(d)] = t; d.setDate(d.getDate() + 1); }
  });

  /* ── 封面數字 ── */
  var daysOnRoad = trips.reduce(function (a, t) {
    return a + Math.round((t.end - t.start) / 864e5) + 1;
  }, 0);
  var nights = trips.reduce(function (a, t) { return a + (+t.nights || 0); }, 0);
  var countries = {};
  trips.forEach(function (t) { if (t.country) countries[t.country] = 1; });

  var elTripCount = document.getElementById("calTripCount");
  if (elTripCount) elTripCount.textContent = pad(trips.length);

  var stats = document.getElementById("calStats");
  if (stats) {
    stats.innerHTML =
      '<div><b>12</b>個月</div>' +
      '<div><b>' + pad(trips.length) + '</b>趟旅行</div>' +
      '<div><b>' + daysOnRoad + '</b>日出走</div>' +
      '<div><b>' + nights + '</b>晚異地</div>';
  }

  var route = document.getElementById("calRoute");
  var names = ["香港"];
  {
    trips.slice().sort(function (a, b) { return a.start - b.start; })
      .forEach(function (t) { if (names.indexOf(t.tag) < 0) names.push(t.tag); });
    var rtext = names.map(function (n, i) { return (i === 0 ? n : "<em>" + n + "</em>"); }).join(" → ");
    if (route) route.innerHTML = rtext;

  }

  /* ── 封面 12 個迷你月 ── */
  var minis = document.getElementById("calMinis");
  if (minis) {
    var html = "";
    for (var m = 0; m < 12; m++) {
      var nDays = new Date(YEAR, m + 1, 0).getDate();
      var bars = "", tags = [], seen = {};
      for (var d = 1; d <= nDays; d++) {
        var t = DAY[YEAR + "-" + pad(m + 1) + "-" + pad(d)];
        if (t) {
          bars += '<i style="background:' + t.color + '"></i>';
          if (!seen[t.tag]) { seen[t.tag] = 1; tags.push(t.tag); }
        } else bars += "<i></i>";
      }
      html += '<div class="cal-mn"><b>' + pad(m + 1) + " " + EN[m].slice(0, 3) + "</b>" +
              '<div class="bars">' + bars + "</div>" +
              '<div class="dots">' + tags.join("·") + "</div></div>";
    }
    minis.innerHTML = html;
  }

  /* ── 12 個月頁 ── */
  var wrap = document.getElementById("calMonths");
  var chips = document.getElementById("calChips");
  var monthHTML = "", chipHTML = "", hasTripMonth = {};

  for (var mm = 1; mm <= 12; mm++) {
    var first = new Date(YEAR, mm - 1, 1);
    var ndays = new Date(YEAR, mm, 0).getDate();
    var lead = (first.getDay() + 6) % 7; /* 星期一 = 0 */
    var cells = "";
    for (var i = 0; i < lead; i++) cells += '<div class="cal-cell void"></div>';

    var monthTrips = [], within = 0;
    trips.forEach(function (t) {
      var s = new Date(Math.max(t.start, new Date(YEAR, mm - 1, 1)));
      var e = new Date(Math.min(t.end, new Date(YEAR, mm, 0)));
      if (s <= e) {
        monthTrips.push(t);
        within += Math.round((e - s) / 864e5) + 1;
        hasTripMonth[mm] = true;
      }
    });

    var prevTrip = null;
    for (var dd = 1; dd <= ndays; dd++) {
      var dateObj = new Date(YEAR, mm - 1, dd);
      var tt = DAY[key(dateObj)];
      if (tt) {
        var rgb = hexRGB(tt.color);
        var mark = (prevTrip !== tt)
          ? '<span class="chip">' + esc(tt.tag) + "</span>"
          : '<span class="dot"></span>';
        cells += '<div class="cal-cell on" style="--c:' + tt.color +
                 ';--bg2:rgba(' + rgb + ',.14);--bd2:rgba(' + rgb + ',.5)">' +
                 '<span class="d">' + dd + "</span>" + mark + "</div>";
      } else {
        cells += '<div class="cal-cell"><span class="d">' + dd + "</span></div>";
      }
      prevTrip = tt || null;
    }

    /* 左欄：行程卡 + 相 */
    var side = "";
    if (monthTrips.length) {
      monthTrips.forEach(function (t) {
        side += '<div class="cal-tcard" style="--c:' + t.color + '">' +
                '<a href="' + link(t) + '">' + esc(t.title) + "</a>" +
                '<div class="meta">' + (t.start.getMonth() + 1) + "." + pad(t.start.getDate()) +
                " – " + (t.end.getMonth() + 1) + "." + pad(t.end.getDate()) +
                (t.nights ? " · " + t.nights + " 晚" : "") + "</div>" +
                '<div class="kind">' + esc(t.kind) + "</div>" +
                (t.with_ ? '<div class="with">WITH：' + esc(t.with_) + "</div>" : "") +
                "</div>" +
                '<div class="cal-ph"><img loading="lazy" src="' + cover(t) + '" alt="' + esc(t.tag) +
                '" onerror="this.closest(\'.cal-ph\').remove()">' +
                '<div class="cap">' + esc(t.tag) + " · " +
                (t.start.getMonth() + 1) + "." + pad(t.start.getDate()) + "</div></div>";
      });
    }

    if (!monthTrips.length) {
      var mini = "", mv = "";
      for (var v = 0; v < lead; v++) mv += '<i class="v"></i>';
      for (var md = 1; md <= ndays; md++) mv += "<i></i>";
      monthHTML +=
        '<section class="cal-m slim" id="m-' + pad(mm) + '" data-has="0">' +
        '<div class="cal-mhead"><span class="cal-no">' + pad(mm) + "</span>" +
        "<h2>" + ZH[mm - 1] + '</h2><span class="cal-en">' + EN[mm - 1] + " " + YEAR + "</span></div>" +
        '<div class="cal-slim"><div class="cal-mini">' + mv + "</div>" +
        '<div class="cal-slim-note">01 – ' + pad(ndays) + " " + EN[mm - 1].slice(0, 3) + " " + YEAR +
        " · 未有行程</div></div></section>";
      chipHTML += '<button class="cal-chip" data-m="' + pad(mm) + '">' + pad(mm) + "</button>";
      continue;
    }

    monthHTML +=
      '<section class="cal-m" id="m-' + pad(mm) + '" data-has="1">' +
      '<div class="cal-mhead"><span class="cal-no">' + pad(mm) + "</span>" +
      "<h2>" + ZH[mm - 1] + '</h2><span class="cal-en">' + EN[mm - 1] + " " + YEAR + "</span>" +
      '<span class="cal-stat">' + (within
        ? "本月 " + within + " 日出走 · " + monthTrips.length + " 段行程"
        : "本月 0 日出走") + "</span></div>" +
      '<div class="cal-body"><div class="cal-side">' + side + "</div>" +
      '<div class="cal-grid"><div class="cal-whead">' + WD.map(function (w) { return "<span>" + w + "</span>"; }).join("") +
      '</div><div class="cal-cells">' + cells + "</div>" +
      '<div class="cal-legend">' + legendHTML(monthTrips) + "</div></div></div></section>";

    chipHTML += '<button class="cal-chip' + (hasTripMonth[mm] ? " has" : "") +
      '" data-m="' + pad(mm) + '"' + (hasTripMonth[mm] ? ' style="--c:' + monthTripColor(mm) + '"' : "") +
      ">" + pad(mm) + "</button>";
  }

  function monthTripColor(m) {
    var found = null;
    trips.forEach(function (t) {
      var s = new Date(Math.max(t.start, new Date(YEAR, m - 1, 1)));
      var e = new Date(Math.min(t.end, new Date(YEAR, m, 0)));
      if (s <= e && !found) found = t;
    });
    return found ? found.color : "#b5502f";
  }
  function legendHTML(list) {
    return (list || []).map(function (t) {
      return '<span><i style="background:' + t.color + '"></i>' + esc(t.tag) + "</span>";
    }).join("");
  }
  function hexRGB(h) {
    h = String(h).replace("#", "");
    return parseInt(h.slice(0, 2), 16) + "," + parseInt(h.slice(2, 4), 16) + "," + parseInt(h.slice(4, 6), 16);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (wrap) wrap.innerHTML = monthHTML;
  if (chips) chips.innerHTML = chipHTML;

  /* ── 跳轉 + 高亮 ── */
  if (chips) {
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".cal-chip");
      if (!b) return;
      var target = document.getElementById("m-" + b.dataset.m);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }
  var active = null;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          active = en.target.id.slice(2);
          Array.prototype.forEach.call(chips ? chips.children : [], function (c) {
            c.classList.toggle("on", c.dataset.m === active);
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll(".cal-m"), function (s) { io.observe(s); });
  }

  /* ── 只睇有行程 ── */
  var tog = document.getElementById("onlyTrips");
  if (tog) {
    var saved = false;
    try { saved = localStorage.getItem("calOnlyTrips") === "1"; } catch (err) {}
    tog.checked = saved;
    var apply = function () {
      var only = tog.checked;
      Array.prototype.forEach.call(document.querySelectorAll(".cal-m"), function (s) {
        s.style.display = (only && s.dataset.has !== "1") ? "none" : "";
      });
      Array.prototype.forEach.call(chips ? chips.children : [], function (c) {
        c.style.display = (only && !c.classList.contains("has")) ? "none" : "";
      });
      try { localStorage.setItem("calOnlyTrips", only ? "1" : "0"); } catch (err) {}
    };
    tog.addEventListener("change", apply);
    apply();
  }

  /* ── 封面滑鼠微傾（只限有滑鼠） ── */
  var book = document.getElementById("calBook");
  if (book && window.matchMedia("(hover: hover)").matches) {
    var stage = book.parentNode;
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      book.style.transform = "translateY(-4px) rotateY(" + (-24 + x * 8) + "deg) rotateX(" + (8 - y * 6) + "deg) rotateZ(-1.4deg)";
    });
    stage.addEventListener("pointerleave", function () {
      book.style.transform = "";
    });
  }
})();
