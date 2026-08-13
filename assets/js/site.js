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

  /* Path D — rotating home tagline (slide via WAAPI; works even with OS reduce-motion) */
  (function initTagline() {
    var line = document.querySelector("#banner [data-tagline]");
    if (!line) return;

    // Taglines should sound like Saxo, not a startup pitch.
    // Voice cues: dry, short, slightly unserious — “or whatever”, “Search for the things”,
    // GitHub: “I don't even know what pro does.” Keep “World renowned Unicorn Rider”.
    var lines = [
      "World renowned Unicorn Rider",
      "Official website of doom, or whatever",
      "Games, tools, n whatnot",
      "Making stuff since 2015",
    ];
    var i = 0;
    var busy = false;
    var OUT_MS = 360;
    var IN_MS = 420;
    var HOLD_MS = 2600;

    function slideTo(next) {
      if (busy) return;
      busy = true;

      function finishIn() {
        busy = false;
      }

      if (typeof line.animate !== "function") {
        line.textContent = next;
        finishIn();
        return;
      }

      var out = line.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-0.85em)" },
        ],
        {
          duration: OUT_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );

      out.onfinish = function () {
        line.textContent = next;
        var inn = line.animate(
          [
            { opacity: 0, transform: "translateY(0.85em)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: IN_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
        inn.onfinish = finishIn;
      };
    }

    window.setInterval(function () {
      i = (i + 1) % lines.length;
      slideTo(lines[i]);
    }, HOLD_MS);
  })();

  /* Expandable nav search — WAAPI so it still animates when OS “reduce motion” kills CSS transitions */
  (function initNavSearch() {
    var form = document.querySelector("[data-nav-search]");
    if (!form) return;
    var panel = form.querySelector("[data-nav-search-panel]");
    var input = form.querySelector(".site-nav__search-input");
    var toggle = form.querySelector("[data-nav-search-toggle]");
    var submit = form.querySelector(".site-nav__search-submit");
    if (!panel || !input || !toggle || !submit) return;

    var OPEN_MS = 420;
    var anim = null;
    var openTimer = null;

    function panelWidthPx() {
      var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return Math.min(14 * rem, window.innerWidth * 0.56);
    }

    function stopAnim() {
      if (anim) {
        try {
          anim.cancel();
        } catch (e) {}
        anim = null;
      }
    }

    function setOpenUi(isOpen) {
      form.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Close search" : "Open search");
      submit.hidden = !isOpen;
      if (isOpen) input.removeAttribute("tabindex");
      else input.setAttribute("tabindex", "-1");
    }

    function open() {
      if (form.classList.contains("is-open") && panel.getBoundingClientRect().width > 8) {
        input.focus();
        return;
      }
      window.clearTimeout(openTimer);
      stopAnim();
      setOpenUi(true);
      var end = panelWidthPx() + "px";
      panel.style.maxWidth = "0px";
      panel.style.width = "auto";
      panel.style.opacity = "0";
      if (typeof panel.animate === "function") {
        anim = panel.animate(
          [
            { maxWidth: "0px", opacity: 0 },
            { maxWidth: end, opacity: 1 },
          ],
          {
            duration: OPEN_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
        anim.onfinish = function () {
          panel.style.maxWidth = end;
          panel.style.opacity = "1";
          anim = null;
          input.focus();
        };
      } else {
        panel.style.transition = "max-width " + OPEN_MS + "ms cubic-bezier(0.22,1,0.36,1), opacity .6s ease";
        requestAnimationFrame(function () {
          panel.style.maxWidth = end;
          panel.style.opacity = "1";
        });
        openTimer = window.setTimeout(function () {
          input.focus();
        }, OPEN_MS);
      }
    }

    function close() {
      window.clearTimeout(openTimer);
      stopAnim();
      var start = panel.getBoundingClientRect().width + "px";
      if (typeof panel.animate === "function") {
        anim = panel.animate(
          [
            { maxWidth: start, opacity: 1 },
            { maxWidth: "0px", opacity: 0 },
          ],
          {
            duration: Math.round(OPEN_MS * 0.75),
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );
        anim.onfinish = function () {
          panel.style.maxWidth = "0px";
          panel.style.opacity = "0";
          anim = null;
          setOpenUi(false);
          input.blur();
        };
      } else {
        panel.style.maxWidth = "0px";
        panel.style.opacity = "0";
        setOpenUi(false);
        input.blur();
      }
    }

    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
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
