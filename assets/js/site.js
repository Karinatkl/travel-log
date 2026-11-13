/* 總表：搜尋、篩選、排序。純 vanilla，無依賴。 */
(function () {
  "use strict";

  var table = document.getElementById("trip-table");
  if (!table) return;

  var tbody = table.tBodies[0];
  var rows = Array.prototype.slice.call(tbody.rows);
  var q = document.getElementById("q");
  var fStatus = document.getElementById("f-status");
  var fType = document.getElementById("f-type");
  var fCountry = document.getElementById("f-country");
  var countEl = document.getElementById("count");
  var emptyEl = document.getElementById("empty");

  // 手機卡片模式用：把表頭文字寫入每個 td 的 data-label
  var heads = Array.prototype.slice.call(table.tHead.rows[0].cells).map(function (th) {
    return th.textContent.trim();
  });

  function labelCells() {
    rows.forEach(function (row) {
      Array.prototype.forEach.call(row.cells, function (td, i) {
        if (heads[i]) td.setAttribute("data-label", heads[i]);
      });
    });
  }
  labelCells();

  function match(row) {
    var text = (row.getAttribute("data-search") || "").toLowerCase();
    var query = q ? q.value.trim().toLowerCase() : "";
    if (query && text.indexOf(query) === -1) return false;
    if (fStatus && fStatus.value && row.getAttribute("data-status") !== fStatus.value) return false;
    if (fType && fType.value && row.getAttribute("data-type") !== fType.value) return false;
    if (fCountry && fCountry.value && row.getAttribute("data-country") !== fCountry.value) return false;
    return true;
  }

  function apply() {
    var visible = 0;
    rows.forEach(function (row) {
      var ok = match(row);
      row.hidden = !ok;
      if (ok) visible++;
    });
    if (countEl) countEl.textContent = visible + " / " + rows.length + " 個行程";
    if (emptyEl) emptyEl.hidden = visible !== 0;
  }

  [q, fStatus, fType, fCountry].forEach(function (el) {
    if (!el) return;
    el.addEventListener(el.tagName === "SELECT" ? "change" : "input", apply);
  });

  // 排序：預設日期倒序
  var sortState = { key: "start", asc: false };

  function sortBy(key, asc) {
    rows.sort(function (a, b) {
      var av = key === "title"
        ? (a.getAttribute("data-title") || "")
        : (a.getAttribute("data-start") || "");
      var bv = key === "title"
        ? (b.getAttribute("data-title") || "")
        : (b.getAttribute("data-start") || "");
      if (av === bv) return 0;
      var r = av < bv ? -1 : 1;
      return asc ? r : -r;
    });
    rows.forEach(function (row) { tbody.appendChild(row); });
  }

  Array.prototype.forEach.call(table.tHead.querySelectorAll("th[data-sort]"), function (th) {
    th.addEventListener("click", function () {
      var key = th.getAttribute("data-key");
      sortState.asc = sortState.key === key ? !sortState.asc : true;
      sortState.key = key;
      sortBy(key, sortState.asc);
      Array.prototype.forEach.call(table.tHead.querySelectorAll("th"), function (h) {
        h.removeAttribute("aria-sort");
      });
      th.setAttribute("aria-sort", sortState.asc ? "ascending" : "descending");
    });
  });

  sortBy(sortState.key, sortState.asc);
  apply();
})();
