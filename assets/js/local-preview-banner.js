(function () {
  var host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") return;

  var bar = document.createElement("div");
  bar.id = "local-preview-banner";
  bar.setAttribute("role", "status");
  bar.innerHTML =
    "LOCAL PREVIEW — Eleventy build at " +
    window.location.origin +
    " — not saxobroko.com. Tagline should rotate. " +
    '<a href="/look.html" style="color:#000;font-weight:800;text-decoration:underline">Open proof page</a>';
  document.documentElement.appendChild(bar);

  var style = document.createElement("style");
  style.textContent =
    "#local-preview-banner{position:fixed;top:0;left:0;right:0;z-index:2147483647;" +
    "background:#ffe600;color:#111;font:700 14px/1.3 system-ui,sans-serif;" +
    "padding:10px 16px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.35)}" +
    "body{padding-top:44px !important}";
  document.head.appendChild(style);
})();
