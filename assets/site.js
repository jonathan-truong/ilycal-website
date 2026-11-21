(function () {
  // The ilyCal heart, drawn in calendar squares like the app icon. Squares pop in from the centre out.
  var rows = [".XX...XX.", "XXXX.XXXX", "XXXXXXXXX", ".XXXXXXX.", "..XXXXX..", "...XXX...", "....X...."];
  document.querySelectorAll(".heartgrid").forEach(function (grid) {
    var html = "";
    rows.forEach(function (r, y) { r.split("").forEach(function (c, x) {
      var d = Math.round(Math.hypot(x - 4, y - 3) * 90);
      html += '<i class="' + (y === 3 && x === 4 ? "today" : c === "X" ? "on" : "") + '" style="--d:' + d + '"></i>';
    }); });
    grid.innerHTML = html;
  });

  var still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function type(el) {
    var text = el.textContent, n = 0;
    if (still) return;
    el.textContent = "";
    (function tick() { el.textContent = text.slice(0, ++n); if (n < text.length) setTimeout(tick, 34 + Math.random() * 40); })();
  }
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      e.target.querySelectorAll(".heartgrid").forEach(function (g) { g.classList.add("in"); });
      var t = e.target.querySelector("[data-type]"); if (t) setTimeout(function () { type(t); }, 500);
      seen.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { seen.observe(el); });
  requestAnimationFrame(function () { document.querySelector(".hero .heartgrid").classList.add("in"); });

  // Agenda / Day / Week / Month: the phone flips to the real capture of that view.
  var notes = {
    agenda: "A running list of what’s next, with a face on every plan.",
    day: "Tuesday by the hour, from drop-off to the dentist. Plans that overlap sit side by side.",
    week: "Seven days on one screen, a row for each.",
    month: "The big picture, with trips stretched across the days they cover."
  };
  var card = document.querySelector(".switcher .flip-card"), note = document.querySelector(".view-note"), busy = false;
  function show(view) {
    card.querySelectorAll("img").forEach(function (img) {
      var on = img.dataset.view === view; img.classList.toggle("on", on); img.setAttribute("aria-hidden", on ? "false" : "true");
    });
    note.textContent = notes[view];
  }
  show("week");
  document.querySelectorAll(".views button").forEach(function (button) {
    button.addEventListener("click", function () {
      if (busy || button.getAttribute("aria-pressed") === "true") return;
      document.querySelectorAll(".views button").forEach(function (b) { b.setAttribute("aria-pressed", b === button ? "true" : "false"); });
      card.querySelectorAll("img").forEach(function (img) { img.loading = "eager"; });
      if (still) { show(button.dataset.view); return; }
      busy = true; card.classList.add("out");
      setTimeout(function () {
        show(button.dataset.view);
        card.classList.remove("out"); card.classList.add("back");
        void card.offsetWidth;
        card.classList.remove("back"); card.classList.add("in");
        setTimeout(function () { card.classList.remove("in"); busy = false; }, 440);
      }, 270);
    });
  });
})();
