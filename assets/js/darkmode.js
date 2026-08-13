/**
 * Theme toggle — class/CSS-variable based (not mix-blend inversion).
 * Persists preference in localStorage key `sb-theme` ("light" | "dark").
 * Falls back to prefers-color-scheme when unset.
 */
(function () {
  var KEY = "sb-theme";
  var root = document.documentElement;
  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function resolve(explicit) {
    if (explicit === "light" || explicit === "dark") return explicit;
    return mq.matches ? "dark" : "light";
  }

  function apply(theme, persist) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0c0e12" : "#eceff3");
    }
    if (persist) {
      try {
        localStorage.setItem(KEY, theme);
      } catch (e) {}
    }
    syncToggle(theme);
  }

  function current() {
    return root.getAttribute("data-theme") || resolve(stored());
  }

  function syncToggle(theme) {
    var btn = document.getElementById("theme-toggle");
    if (!btn) return;
    var dark = theme === "dark";
    btn.setAttribute("aria-pressed", dark ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      dark ? "Switch to light mode" : "Switch to dark mode"
    );
    btn.title = dark ? "Light mode" : "Dark mode";
  }

  function ensureToggle() {
    if (document.getElementById("theme-toggle")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "theme-toggle";
    btn.className = "theme-toggle";
    btn.innerHTML =
      '<span class="theme-toggle__moon" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z"/></svg></span>' +
      '<span class="theme-toggle__sun" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>' +
      "</svg></span>";
    btn.addEventListener("click", function () {
      apply(current() === "dark" ? "light" : "dark", true);
    });
    var slot = document.querySelector(".site-nav__end");
    if (slot) slot.appendChild(btn);
    else document.body.appendChild(btn);
    syncToggle(current());
  }

  // Migrate legacy darkmode-js preference once (before first paint sync)
  try {
    if (localStorage.getItem(KEY) == null && localStorage.getItem("darkmode") === "true") {
      localStorage.setItem(KEY, "dark");
      localStorage.removeItem("darkmode");
    }
  } catch (e) {}

  // Re-apply in case head boot ran before this, and keep OS sync when unset
  apply(resolve(stored()), false);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureToggle);
  } else {
    ensureToggle();
  }

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", function () {
      if (!stored()) apply(resolve(null), false);
    });
  } else if (typeof mq.addListener === "function") {
    mq.addListener(function () {
      if (!stored()) apply(resolve(null), false);
    });
  }
})();
