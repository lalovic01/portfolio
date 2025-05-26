const darkToggle = document.getElementById("darkToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const scrollToTopBtn = document.getElementById("scrollToTop");
const contactForm = document.getElementById("contactForm");
const navLinks = document.querySelectorAll(".nav-link");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

darkToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem(
    "darkMode",
    document.documentElement.classList.contains("dark")
  );
});

if (localStorage.getItem("darkMode") === "true") {
  document.documentElement.classList.add("dark");
}

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

document.addEventListener("click", (e) => {
  if (
    mobileMenu &&
    !mobileMenu.classList.contains("hidden") &&
    !e.target.closest("#mobileMenu") &&
    !e.target.closest("#mobileMenuBtn")
  ) {
    mobileMenu.classList.add("hidden");
  }
});

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.remove("opacity-0", "invisible");
  } else {
    scrollToTopBtn.classList.add("opacity-0", "invisible");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const scrollPosition = window.scrollY + 100;

  if (window.scrollY < 100) {
    navLinks.forEach((link) => link.classList.remove("text-orange-500"));
    const homeLink = document.querySelector('.nav-link[href="#home"]');
    if (homeLink) homeLink.classList.add("text-orange-500");
    return;
  }

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      navLinks.forEach((link) => link.classList.remove("text-orange-500"));
      const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
      );
      if (activeLink) activeLink.classList.add("text-orange-500");
    }
  });
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  let isValid = true;

  document
    .querySelectorAll(".error-message")
    .forEach((error) => error.classList.add("hidden"));
  document
    .querySelectorAll(".form-input")
    .forEach((input) => input.classList.remove("border-red-500"));

  if (!name.value.trim()) {
    showError("nameError", name);
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    showError("emailError", email);
    isValid = false;
  }

  if (!message.value.trim()) {
    showError("messageError", message);
    isValid = false;
  }

  if (isValid) {
    document.getElementById("formSuccess").classList.remove("hidden");
    contactForm.reset();

    setTimeout(() => {
      document.getElementById("formSuccess").classList.add("hidden");
    }, 5000);
  }
});

function showError(errorId, inputElement) {
  document.getElementById(errorId).classList.remove("hidden");
  inputElement.classList.add("border-red-500");
}

const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

document.querySelectorAll(".skill-button").forEach((button, index) => {
  button.style.animationDelay = `${index * 0.1}s`;

  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-8px) scale(1.05)";
    button.style.boxShadow =
      "0 20px 25px -5px rgba(249, 115, 22, 0.2), 0 10px 10px -5px rgba(249, 115, 22, 0.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0) scale(1)";
    button.style.boxShadow = "";
  });

  button.addEventListener("click", (e) => {
    const skillName = button.getAttribute("data-skill");

    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(249, 115, 22, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

    console.log(`Clicked skill: ${skillName}`);

    button.style.background = "rgba(249, 115, 22, 0.1)";
    setTimeout(() => {
      button.style.background = "";
    }, 300);
  });

  button.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      button.click();
    }
  });
});

const style = document.createElement("style");
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  .skill-button {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector(".animate-float");

  if (parallax) {
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

function typeWriter(element, text, speed = 100) {
  element.innerHTML = "";
  element.style.opacity = "1";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

document.addEventListener("DOMContentLoaded", () => {
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    const nameText = "Mladen Lalović";
    setTimeout(() => {
      typeWriter(heroTitle, nameText, 120);
    }, 800);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const workTab = document.getElementById("workTab");
  const educationTab = document.getElementById("educationTab");
  const workContent = document.getElementById("workContent");
  const educationContent = document.getElementById("educationContent");

  function switchToTab(targetTab, targetContent) {
    [workTab, educationTab].forEach((tab) => tab.classList.remove("active"));
    [workContent, educationContent].forEach((content) => {
      content.classList.remove("active");
      content.style.position = "absolute";
      content.style.opacity = "0";
      content.style.visibility = "hidden";
      content.style.pointerEvents = "none";
    });

    targetTab.classList.add("active");

    setTimeout(() => {
      targetContent.style.position = "relative";
      targetContent.style.opacity = "1";
      targetContent.style.visibility = "visible";
      targetContent.style.pointerEvents = "auto";
      targetContent.classList.add("active");

      const items = targetContent.querySelectorAll(".animate-slide-in");
      items.forEach((item, index) => {
        item.style.animation = "none";
        item.style.opacity = "0";
        item.style.transform = "translateX(30px)";

        setTimeout(() => {
          item.style.animation = `slideInFromRight 0.6s ease-out forwards`;
        }, index * 100);
      });
    }, 100);
  }

  if (workTab && educationTab && workContent && educationContent) {
    workTab.addEventListener("click", (e) => {
      e.preventDefault();
      if (!workTab.classList.contains("active")) {
        switchToTab(workTab, workContent);
      }
    });

    educationTab.addEventListener("click", (e) => {
      e.preventDefault();
      if (!educationTab.classList.contains("active")) {
        switchToTab(educationTab, educationContent);
      }
    });

    [workTab, educationTab].forEach((tab) => {
      tab.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tab.click();
        }
      });
    });

    switchToTab(workTab, workContent);
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const headerHeight = document.querySelector("header").offsetHeight;

      if (this.getAttribute("href") === "#home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("projectsSlider");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dots = document.querySelectorAll(".slider-dot");

  if (!slider || !prevBtn || !nextBtn) return;

  let currentSlide = 0;
  let slidesPerView = 3;
  let totalSlides = 6;

  function updateSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) {
      slidesPerView = 1;
    } else if (width < 1024) {
      slidesPerView = 2;
    } else {
      slidesPerView = 3;
    }
  }

  function getTotalPages() {
    return Math.ceil(totalSlides / slidesPerView);
  }

  function updateSlider() {
    const translateX = -(currentSlide * (100 / slidesPerView));
    slider.style.transform = `translateX(${translateX}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= getTotalPages() - 1;
  }

  function nextSlide() {
    if (currentSlide < getTotalPages() - 1) {
      currentSlide++;
      updateSlider();
    }
  }

  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      updateSlider();
    }
  }

  function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  let autoPlayInterval;

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      if (currentSlide >= getTotalPages() - 1) {
        currentSlide = 0;
      } else {
        currentSlide++;
      }
      updateSlider();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  slider.addEventListener("mouseenter", stopAutoPlay);
  slider.addEventListener("mouseleave", startAutoPlay);

  window.addEventListener("resize", () => {
    updateSlidesPerView();
    currentSlide = 0;
    updateSlider();
  });

  updateSlidesPerView();
  updateSlider();
  startAutoPlay();
});
