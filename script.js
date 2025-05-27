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

class LoadingManager {
  constructor() {
    this.activeLoaders = new Set();
    this.pageLoaded = false;
  }

  showPageLoader() {
    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader) {
      pageLoader.classList.remove("hidden");
    }
  }

  hidePageLoader() {
    const pageLoader = document.getElementById("pageLoader");
    if (pageLoader) {
      pageLoader.classList.add("hidden");
      this.pageLoaded = true;
      this.showContent();
    }
  }

  showContent() {
    document.querySelectorAll(".skeleton-content").forEach((skeleton) => {
      skeleton.classList.add("hidden");
    });

    document.querySelectorAll(".content-fade-in").forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("loaded");
      }, index * 100);
    });
  }

  showSectionLoader(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const loader = section.querySelector(".loading-overlay");
      if (loader) {
        loader.classList.add("active");
        this.activeLoaders.add(sectionId);
      }
    }
  }

  hideSectionLoader(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const loader = section.querySelector(".loading-overlay");
      if (loader) {
        loader.classList.remove("active");
        this.activeLoaders.delete(sectionId);
      }
    }
  }

  showFormLoader(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.classList.add("form-loading");
    }
  }

  hideFormLoader(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.classList.remove("form-loading");
    }
  }

  showButtonLoader(buttonElement) {
    if (buttonElement) {
      buttonElement.classList.add("btn-loading");
      buttonElement.disabled = true;
    }
  }

  hideButtonLoader(buttonElement) {
    if (buttonElement) {
      buttonElement.classList.remove("btn-loading");
      buttonElement.disabled = false;
    }
  }
}

const loadingManager = new LoadingManager();

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;

  loadingManager.showButtonLoader(submitButton);
  submitButton.innerHTML = '<span class="btn-text">Sending...</span>';

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

  if (!isValid) {
    loadingManager.hideButtonLoader(submitButton);
    submitButton.innerHTML = originalText;
    return;
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    document.getElementById("formSuccess").classList.remove("hidden");
    contactForm.reset();

    setTimeout(() => {
      document.getElementById("formSuccess").classList.add("hidden");
    }, 5000);
  } catch (error) {
    console.error("Form submission error:", error);

    const errorDiv = document.createElement("div");
    errorDiv.className =
      "mt-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg";
    errorDiv.innerHTML =
      '<i class="fas fa-exclamation-triangle mr-2"></i>Failed to send message. Please try again.';
    contactForm.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  } finally {
    loadingManager.hideButtonLoader(submitButton);
    submitButton.innerHTML = originalText;
  }
});

class ImageLoader {
  constructor() {
    this.lazyImages = document.querySelectorAll(".lazy-image");
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      });

      this.lazyImages.forEach((img) => {
        this.imageObserver.observe(img);
      });
    } else {
      this.lazyImages.forEach((img) => this.loadImage(img));
    }
  }

  loadImage(img) {
    const placeholder = img.parentElement.querySelector(".image-placeholder");

    img.onload = () => {
      img.classList.add("loaded");
      if (placeholder) {
        placeholder.style.opacity = "0";
        setTimeout(() => placeholder.remove(), 300);
      }
    };

    img.onerror = () => {
      img.style.display = "none";
      if (placeholder) {
        placeholder.innerHTML =
          '<div class="flex items-center justify-center h-full text-gray-400"><i class="fas fa-image text-2xl"></i></div>';
      }
    };

    if (img.dataset.src) {
      img.src = img.dataset.src;
    }
  }
}

function loadSkillsWithAnimation() {
  const skillsSection = document.getElementById("skills");
  const skillsSkeleton = skillsSection.querySelector(".skeleton-content");
  const skillsContent = skillsSection.querySelector(".skills-content");

  setTimeout(() => {
    if (skillsSkeleton) {
      skillsSkeleton.classList.add("hidden");
    }
    if (skillsContent) {
      skillsContent.classList.remove("hidden");
      skillsContent.classList.add("content-fade-in", "loaded");
    }
  }, 1000);
}

function loadProjectsWithAnimation() {
  const projectsSection = document.getElementById("projects");
  const projectsSkeleton = projectsSection.querySelector(".skeleton-content");
  const projectsContent = projectsSection.querySelector(".projects-content");

  setTimeout(() => {
    if (projectsSkeleton) {
      projectsSkeleton.classList.add("hidden");
    }
    if (projectsContent) {
      projectsContent.classList.remove("hidden");
      projectsContent.classList.add("content-fade-in", "loaded");
    }
  }, 1500);
}

function adjustHeroSpacing() {
  const header = document.querySelector("header");
  const heroSection = document.getElementById("home");

  if (header && heroSection) {
    const headerHeight = header.offsetHeight;
    const viewportHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;

    let safePadding;

    if (isMobile) {
      safePadding = headerHeight + 40;
      if (window.innerWidth <= 360) {
        safePadding = headerHeight + 60;
      }
    } else {
      safePadding = headerHeight + 20;
    }

    heroSection.style.paddingTop = `${safePadding}px`;

    const heroAvatar = heroSection.querySelector(".hero-avatar");
    if (heroAvatar && isMobile) {
      heroAvatar.style.marginTop = "1.5rem";
    }
  }
}

document.addEventListener("DOMContentLoaded", adjustHeroSpacing);
window.addEventListener("resize", adjustHeroSpacing);
window.addEventListener("orientationchange", () => {
  setTimeout(adjustHeroSpacing, 200);
});

document.addEventListener("DOMContentLoaded", () => {
  loadingManager.showPageLoader();

  new ImageLoader();

  setTimeout(() => {
    adjustHeroSpacing();
    loadingManager.hidePageLoader();
    loadSkillsWithAnimation();
    loadProjectsWithAnimation();
  }, 1500);

  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    const nameText = "Mladen Lalović";
    setTimeout(() => {
      typeWriter(heroTitle, nameText, 120);
    }, 850);
  }

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

  window.addEventListener("resize", () => {
    updateSlidesPerView();
    currentSlide = 0;
    updateSlider();
  });

  updateSlidesPerView();
  updateSlider();
});

window.addEventListener("load", () => {
  setTimeout(() => {
    loadingManager.hidePageLoader();
  }, 500);
});

window.addEventListener("online", () => {
  console.log("Connection restored");
});

window.addEventListener("offline", () => {
  console.log("Connection lost");
  const offlineMessage = document.createElement("div");
  offlineMessage.id = "offlineMessage";
  offlineMessage.className =
    "fixed top-4 right-4 bg-yellow-500 text-white p-4 rounded-lg shadow-lg z-50";
  offlineMessage.innerHTML =
    '<i class="fas fa-wifi mr-2"></i>Connection lost. Some features may not work.';
  document.body.appendChild(offlineMessage);
});

if ("PerformanceObserver" in window) {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "navigation") {
        console.log(
          "Page load performance:",
          entry.loadEventEnd - entry.loadEventStart,
          "ms"
        );
      }
    });
  });
  observer.observe({ entryTypes: ["navigation"] });
}

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
