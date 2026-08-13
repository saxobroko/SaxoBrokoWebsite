(function () {
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* ---- Path A: Hero ---- */
  function initHero() {
    var panel = qs("#path-a");
    if (!panel) return;
    var hero = qs("[data-hero]", panel);
    var tilt = qs("[data-hero-tilt]", panel);
    var forceReduced = false;

    function reduced() {
      return forceReduced || prefersReduced.matches;
    }

    function play() {
      hero.classList.remove("is-ready", "is-reduced", "reduce-motion");
      void hero.offsetWidth;
      if (reduced()) {
        hero.classList.add("is-reduced", "reduce-motion");
      } else {
        hero.classList.add("is-ready");
      }
    }

    play();

    var replay = qs('[data-action="replay-hero"]', panel);
    if (replay) replay.addEventListener("click", play);

    var toggle = qs('[data-action="toggle-motion-a"]', panel);
    if (toggle) {
      toggle.addEventListener("change", function () {
        forceReduced = toggle.checked;
        play();
      });
    }

    if (!tilt) return;

    var touching = false;
    window.addEventListener(
      "touchstart",
      function () {
        touching = true;
      },
      { passive: true }
    );

    hero.addEventListener("pointermove", function (e) {
      if (reduced() || touching || e.pointerType === "touch") return;
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform =
        "rotateY(" + x * 8 + "deg) rotateX(" + -y * 6 + "deg)";
    });

    hero.addEventListener("pointerleave", function () {
      tilt.style.transform = "";
    });
  }

  /* ---- Path B: Page feel ---- */
  function initPageFeel() {
    var panel = qs("#path-b");
    if (!panel) return;
    var box = qs("[data-pagefeel]", panel);

    function play() {
      box.classList.remove("is-ready");
      void box.offsetWidth;
      if (prefersReduced.matches) box.classList.add("reduce-motion");
      else box.classList.remove("reduce-motion");
      box.classList.add("is-ready");
    }

    play();

    var replay = qs('[data-action="replay-pagefeel"]', panel);
    if (replay) replay.addEventListener("click", play);
  }

  /* ---- Path C: Gallery ---- */
  function initGallery() {
    var panel = qs("#path-c");
    if (!panel) return;
    var gallery = qs("[data-gallery]", panel);
    var chips = qsa(".ux-chip", gallery);
    var media = qsa("[data-media]", gallery);

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var tag = chip.getAttribute("data-tag");
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-selected", on ? "true" : "false");
        });

        media.forEach(function (el) {
          var show = tag === "all" || el.classList.contains(tag);
          if (prefersReduced.matches) {
            el.classList.toggle("is-hidden", !show);
            el.classList.remove("is-fading");
            return;
          }
          if (!show) {
            el.classList.add("is-fading");
            window.setTimeout(function () {
              el.classList.add("is-hidden");
              el.classList.remove("is-fading");
            }, 160);
          } else {
            el.classList.remove("is-hidden");
            void el.offsetWidth;
            el.classList.remove("is-fading");
          }
        });
      });
    });
  }

  /* ---- Path D: Tagline ---- */
  function initTagline() {
    var panel = qs("#path-d");
    if (!panel) return;
    var line = qs("[data-tagline]", panel);
    var stage = qs(".ux-tagline-demo", panel);
    var lines = [
      "World renowned Unicorn Rider",
      "Official website of doom, or whatever",
      "Games, tools, n whatnot",
      "Making stuff since 2015",
    ];
    var i = 0;
    var paused = false;
    var forceReduced = false;
    var timer = null;

    function reduced() {
      return forceReduced || prefersReduced.matches;
    }

    function show(next) {
      if (reduced()) {
        line.textContent = next;
        line.classList.remove("is-fading");
        return;
      }
      line.classList.add("is-fading");
      window.setTimeout(function () {
        line.textContent = next;
        line.classList.remove("is-fading");
      }, 320);
    }

    function tick() {
      if (paused || reduced()) return;
      i = (i + 1) % lines.length;
      show(lines[i]);
    }

    function start() {
      stop();
      if (stage) stage.classList.toggle("reduce-motion", reduced());
      if (!paused && !reduced()) {
        timer = window.setInterval(tick, 2800);
      }
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    start();

    var pauseBtn = qs('[data-action="toggle-tagline-pause"]', panel);
    if (pauseBtn) {
      pauseBtn.addEventListener("click", function () {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", paused ? "true" : "false");
        pauseBtn.textContent = paused ? "Resume" : "Pause";
        start();
      });
    }

    var toggle = qs('[data-action="toggle-motion-d"]', panel);
    if (toggle) {
      toggle.addEventListener("change", function () {
        forceReduced = toggle.checked;
        if (reduced()) {
          line.textContent = lines[i];
          line.classList.remove("is-fading");
        }
        start();
      });
    }

    prefersReduced.addEventListener("change", start);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initPageFeel();
    initGallery();
    initTagline();
  });
})();
