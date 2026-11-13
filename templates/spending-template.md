---
layout: spending
trip_id: <trip_id>
title: YYYY.MMDD-MMDD 地點｜花費
trip_url: /trips/<trip_id>/
permalink: /trips/<trip_id>/spending/
locked: true
---

<div id="lockbox" class="lockbox">
  <div class="lock-icon">🔒</div>
  <p class="lock-title">呢頁係加密嘅</p>
  <p class="lock-desc">花費內容以 AES-256 加密存放，冇密碼嘅人只會見到亂碼。輸入密碼解鎖。</p>
  <div class="lock-row">
    <input type="password" id="pw" placeholder="密碼" autocomplete="current-password" spellcheck="false">
    <button id="unlock">解鎖</button>
  </div>
  <p id="err" class="lock-err"></p>
</div>

<div id="out" class="prose" hidden></div>

<p id="lockagain" class="lock-again" hidden><button id="relock" class="btn-ghost">🔒 鎖返</button></p>

<script>
(function () {
  var SALT = "<32 hex，每個 trip 一組>";
  var IV = "<32 hex>";
  var ITER = 100000;
  var SRC = "{{ '/assets/enc/<trip_id>-spending.txt' | relative_url }}";
  // …其餘解密邏輯同 trips/2026-11-shenzhen-spending.html 完全一樣，直接複製
})();
</script>

<!--
生成密文（唔准手抄，用 script）：

python3 - <<'PY'
import hashlib, base64, subprocess
pw, salt, iv = b"<PASSWORD>", "<SALT>", "<IV>"
k = hashlib.pbkdf2_hmac("sha256", pw, bytes.fromhex(salt), 100000, 32)
open("/tmp/plain.html","w",encoding="utf-8").write("<花費 HTML>")
subprocess.run(["openssl","enc","-aes-256-cbc","-nosalt","-K",k.hex(),"-iv",iv,
                "-in","/tmp/plain.html","-out","/tmp/plain.enc"], check=True)
print(base64.b64encode(open("/tmp/plain.enc","rb").read()).decode())
PY

輸出貼入 assets/enc/<trip_id>-spending.txt（一行 base64）。

五節固定：1 分類統計 / 2 逐項明細 / 3 代墊同分帳 / 4 對數筆記 / 5 分帳標記說明。
-->
