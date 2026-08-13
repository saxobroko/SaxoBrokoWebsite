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
      "Maker of odd corners of the web",
      "Games, tools, and fish memorials",
      "Still shipping static HTML in 2026",
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
})();
