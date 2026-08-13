(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Path A — home hero entrance + pointer tilt (reveal before js-ux hide rules apply) */
  (function initHero() {
    var hero = document.querySelector("#banner[data-hero]");
    if (!hero) return;
    var tilt = hero.querySelector("[data-hero-tilt]");

    if (prefersReduced.matches) {
      hero.classList.add("is-reduced");
    } else {
      hero.classList.add("is-ready");
    }

    if (!tilt || prefersReduced.matches) return;

    var touching = false;
    window.addEventListener(
      "touchstart",
      function () {
        touching = true;
      },
      { passive: true }
    );

    hero.addEventListener("pointermove", function (e) {
      if (touching || e.pointerType === "touch") return;
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform =
        "rotateY(" + x * 6 + "deg) rotateX(" + -y * 4 + "deg)";
    });

    hero.addEventListener("pointerleave", function () {
      tilt.style.transform = "";
    });
  })();

  /* Path B — main fade-in (class only; CSS keeps content visible without JS) */
  document.documentElement.classList.add("js-ux");
  requestAnimationFrame(function () {
    document.documentElement.classList.add("is-ready");
  });

  /* Path D — rotating home tagline */
  (function initTagline() {
    var line = document.querySelector("#banner [data-tagline]");
    if (!line || prefersReduced.matches) return;

    var lines = [
      "World renowned Unicorn Rider",
      "Digital mischief, handmade",
      "Art, games, and weird ideas",
      "Still shipping static HTML like it matters",
    ];
    var i = 0;

    window.setInterval(function () {
      i = (i + 1) % lines.length;
      line.classList.add("is-fading");
      window.setTimeout(function () {
        line.textContent = lines[i];
        line.classList.remove("is-fading");
      }, 320);
    }, 2200);
  })();

  /* Expandable nav search */
  (function initNavSearch() {
    var form = document.querySelector("[data-nav-search]");
    if (!form) return;
    var input = form.querySelector(".site-nav__search-input");
    var toggle = form.querySelector("[data-nav-search-toggle]");
    if (!input || !toggle) return;

    if (prefersReduced.matches) {
      form.style.transition = "none";
      input.style.transition = "none";
    }

    // Delay focus until the expand has mostly played so the caret doesn’t fight the motion
    var openTimer = null;
    function open() {
      form.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close search");
      input.removeAttribute("tabindex");
      window.clearTimeout(openTimer);
      openTimer = window.setTimeout(
        function () {
          input.focus();
        },
        prefersReduced.matches ? 0 : 750
      );
    }

    function close() {
      window.clearTimeout(openTimer);
      form.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open search");
      input.setAttribute("tabindex", "-1");
      input.blur();
    }

    toggle.addEventListener("click", function () {
      if (form.classList.contains("is-open")) close();
      else open();
    });

    form.addEventListener("submit", function (e) {
      if (!form.classList.contains("is-open")) {
        e.preventDefault();
        open();
        return;
      }
      if (!String(input.value || "").trim()) {
        e.preventDefault();
        input.focus();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && form.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (!form.classList.contains("is-open")) return;
      if (form.contains(e.target)) return;
      if (!String(input.value || "").trim()) close();
    });

    try {
      var params = new URLSearchParams(window.location.search);
      var q = params.get("q");
      if (q) {
        input.value = q;
        open();
      }
    } catch (err) {}
  })();
})();
