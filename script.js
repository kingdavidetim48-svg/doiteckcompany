/* ============================================================
   DOI-TECK CONSTRUCTION — script.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ==================== CURSOR (desktop only) ==================== */
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (
    dot &&
    ring &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    (function animCursor() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      dot.style.cssText = `left:${mx}px;top:${my}px`;
      ring.style.cssText = `left:${rx}px;top:${ry}px`;
      requestAnimationFrame(animCursor);
    })();
  }

  /* ==================== HEADER SCROLL ==================== */
  const header = document.getElementById("header");
  const scrollTop = document.getElementById("scroll-to-top");

  window.addEventListener(
    "scroll",
    () => {
      header?.classList.toggle("scrolled", window.scrollY > 60);
      scrollTop?.classList.toggle("show", window.scrollY > 400);
    },
    { passive: true },
  );

  /* ==================== HAMBURGER ==================== */
  const ham = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("navOverlay");

  function closeMenu() {
    ham?.classList.remove("open");
    navLinks?.classList.remove("open");
    overlay?.classList.remove("active");
    document.body.style.overflow = "";
  }
  function openMenu() {
    ham?.classList.add("open");
    navLinks?.classList.add("open");
    overlay?.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  ham?.addEventListener("click", () => {
    navLinks?.classList.contains("open") ? closeMenu() : openMenu();
  });
  overlay?.addEventListener("click", closeMenu);
  navLinks
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  /* ==================== SMOOTH SCROLL ==================== */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight || 70) + 16;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    });
  });

  /* ==================== SCROLL TO TOP ==================== */
  scrollTop?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ==================== SCROLL REVEAL ==================== */
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          revealObs.unobserve(e.target); // fire once
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el, i) => {
      // Stagger siblings by index within their parent
      const siblings = el.parentElement
        ? [...el.parentElement.children].filter(
            (c) =>
              c.classList.contains("reveal") ||
              c.classList.contains("reveal-left") ||
              c.classList.contains("reveal-right"),
          )
        : [];
      const sibIdx = siblings.indexOf(el);
      if (sibIdx > 0) {
        el.style.transitionDelay = `${sibIdx * 0.08}s`;
      }
      revealObs.observe(el);
    });

  /* ==================== ACTIVE NAV LINK ==================== */
  const sections = document.querySelectorAll("section[id]");
  const navObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks?.querySelectorAll("a").forEach((a) => {
            a.classList.toggle(
              "active",
              a.getAttribute("href") === "#" + e.target.id,
            );
          });
        }
      });
    },
    { threshold: 0.38 },
  );
  sections.forEach((s) => navObs.observe(s));

  /* ==================== COUNTER ANIMATION ==================== */
  /*
   * Rules:
   *  - data-target  = final number
   *  - data-suffix  = suffix (e.g. "+" or "%")
   *  - data-min     = minimum value to display during animation
   *                   (100% client satisfaction never shows <100)
   *  - Counters count UP and never show a value below data-min
   */
  function runCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const minVal = parseFloat(el.dataset.min) || 0;
    const frames = 70;
    let frame = 0;

    // easeOutQuart
    function ease(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    const id = setInterval(() => {
      frame++;
      const progress = ease(frame / frames);
      let current = Math.round(progress * target);

      // NEVER show less than minVal during animation
      if (current < minVal) current = minVal;

      el.textContent = current + suffix;

      if (frame >= frames) {
        el.textContent = target + suffix; // snap to exact final value
        clearInterval(id);
      }
    }, 22);
  }

  const statsBar = document.getElementById("statsBar");
  if (statsBar) {
    let fired = false;
    const statsObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !fired) {
            fired = true;
            statsBar
              .querySelectorAll(".stat-num[data-target]")
              .forEach((el) => runCounter(el));
            statsObs.disconnect();
          }
        });
      },
      { threshold: 0.6 },
    ); // at least 60% visible before starting
    statsObs.observe(statsBar);
  }

  /* ==================== TOAST ==================== */
  const toastBar = document.getElementById("toastBar");
  function showToast(msg, type = "success") {
    if (!toastBar) return;
    toastBar.textContent = msg;
    toastBar.className = `toast-bar show ${type}`;
    clearTimeout(toastBar._t);
    toastBar._t = setTimeout(() => toastBar.classList.remove("show"), 4200);
  }

  /* ==================== FORM SUBMIT ==================== */
  function validateNGPhone(p) {
    return /^(0|\+234|234)[789][01]\d{8}$/.test(p.replace(/\s+/g, ""));
  }

  const form = document.getElementById("quoteForm");
  const loader = document.getElementById("loading-overlay");
  const submitBtn = document.getElementById("submitBtn");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const project = form.querySelector("#project-type")?.value;
    const message = form.message.value.trim();

    if (!name) return showToast("Please enter your name", "error");
    if (!email) return showToast("Please enter your email", "error");
    if (!validateNGPhone(phone))
      return showToast("Enter a valid Nigerian phone number", "error");
    if (!project) return showToast("Please select a project type", "error");
    if (!message) return showToast("Please describe your project", "error");

    submitBtn.disabled = true;
    if (loader) loader.style.display = "flex";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Network error");
      showToast("Enquiry sent! We'll be in touch soon.", "success");
      form.reset();
    } catch {
      showToast("Failed to send. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      if (loader) loader.style.display = "none";
    }
  });
});
