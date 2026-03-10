document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger-menu");
  const navLinks = document.querySelector(".nav-links");
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sections = document.querySelectorAll("section[id]");
  const scrollToTopButton = document.getElementById("scroll-to-top");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    body.style.overflow = navLinks.classList.contains("active")
      ? "hidden"
      : "auto";
  });

  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target) &&
      !themeToggle.contains(e.target)
    ) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
      body.style.overflow = "auto";
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      if (navLinks.classList.contains("active")) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        body.style.overflow = "auto";
      }

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const headerOffset = document.querySelector("header").offsetHeight;
        const offsetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  const reveals = document.querySelectorAll(".reveal");

  const handleScrollAnimations = () => {
    reveals.forEach((el) => {
      const elementTop = el.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.85;

      if (elementTop < triggerPoint && elementTop > -el.offsetHeight) {
        el.classList.add("active");

        const gridItems = el.querySelectorAll(
          ".gallery-item,.choose-us-item,.testimonial-card,.google-review-card",
        );
        gridItems.forEach((item, index) => {
          if (!item.classList.contains("active")) {
            item.style.setProperty("--delay", `${index * 0.1}s`);
            item.classList.add("active");
          }
        });
      } else {
        el.classList.remove("active");
      }
    });
  };

  handleScrollAnimations();
  window.addEventListener("scroll", handleScrollAnimations);

  const setActiveLink = () => {
    let currentActiveSection = "";
    sections.forEach((section) => {
      const sectionTop =
        section.offsetTop - document.querySelector("header").offsetHeight - 10;
      if (window.pageYOffset >= sectionTop) {
        currentActiveSection = section.getAttribute("id");
      }
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.classList.remove("active");

      if (a.getAttribute("href") === `#${currentActiveSection}`) {
        a.classList.add("active");
      }
    });
  };
  setActiveLink();
  window.addEventListener("scroll", setActiveLink);

  const setTheme = (mode) => {
    if (mode === "dark") {
      body.classList.add("dark-mode");
      themeToggle
        .querySelector("ion-icon")
        .setAttribute("name", "sunny-outline");
    } else {
      body.classList.remove("dark-mode");
      themeToggle
        .querySelector("ion-icon")
        .setAttribute("name", "moon-outline");
    }
    localStorage.setItem("theme", mode);
  };

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  themeToggle.addEventListener("click", () => {
    if (body.classList.contains("dark-mode")) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  });

  const toggleScrollToTopButton = () => {
    if (window.pageYOffset > 300) {
      scrollToTopButton.classList.add("show");
    } else {
      scrollToTopButton.classList.remove("show");
    }
  };

  if (scrollToTopButton) {
    scrollToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  toggleScrollToTopButton();
  window.addEventListener("scroll", toggleScrollToTopButton);

  const currentYearSpan = document.getElementById("current-year");
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});

const form = document.querySelector(".quote-form");
const loader = document.getElementById("loading-overlay"); // Corrected ID from 'form-loader' to 'loading-overlay'

function validateNigerianPhone(phone) {
  const cleaned = phone.replace(/\s+/g, "");
  const regex = /^(0|\+234|234)[789][01]\d{8}$/;
  return regex.test(cleaned);
}
function clearErrors() {
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const project = document.getElementById("project-type").value;
  const message = document.getElementById("message").value.trim();

  let hasError = false;

  if (!name) {
    document.getElementById("name-error").textContent = "Name is required.";
    hasError = true;
  }

  if (!email) {
    document.getElementById("email-error").textContent = "Email is required.";
    hasError = true;
  }

  if (!validateNigerianPhone(phone)) {
    document.getElementById("phone-error").textContent =
      "Enter a valid Nigerian phone number.";
    hasError = true;
  }

  if (!project) {
    document.getElementById("project-error").textContent =
      "Please select a project type.";
    hasError = true;
  }

  if (!message) {
    document.getElementById("message-error").textContent =
      "Project details are required.";
    hasError = true;
  }

  if (hasError) return;
  const whatsappMessage = `
Hello, I am ${name}.

Project Type: ${project}
Phone: ${phone}
Email: ${email}

Project Details:
${message}
`;

  const encodedMessage = encodeURIComponent(whatsappMessage);

  // Using the phone number from the top contact info
  const clientNumber = "2348094047342";
  const whatsappURL = `https://wa.me/${clientNumber}?text=${encodedMessage}`;

  if (loader) {
    // Ensure loader exists before trying to display
    loader.style.display = "flex"; // Changed to 'flex' for centering spinner
  }

  let clicks = localStorage.getItem("whatsappClicks") || 0;
  clicks++;
  localStorage.setItem("whatsappClicks", clicks);
  console.log("Total WhatsApp Clicks:", clicks);

  setTimeout(() => {
    window.open(whatsappURL, "_blank");
    if (loader) {
      loader.style.display = "none";
    }
    form.reset();
  }, 1500);

  // WhatsApp sending code here...
});
