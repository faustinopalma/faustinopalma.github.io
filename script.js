(() => {
  const languageButtons = document.querySelectorAll("[data-language]");
  const translatable = document.querySelectorAll("[data-en][data-it]");
  const menuButton = document.querySelector(".menu-button");
  const scrim = document.querySelector(".scrim");
  const navLinks = document.querySelectorAll(".sidebar nav a");
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setLanguage(language, updateUrl = true) {
    const selected = language === "it" ? "it" : "en";
    document.documentElement.lang = selected;
    translatable.forEach((element) => {
      element.textContent = element.dataset[selected];
    });
    languageButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === selected));
    });

    const title = selected === "it"
      ? "Faustino Palma | Cloud, AI e ricerca applicata"
      : "Faustino Palma | Cloud, AI, and applied research";
    document.title = title;

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", selected);
      window.history.replaceState({}, "", url);
    }
  }

  function closeNavigation() {
    document.body.classList.remove("nav-open");
    menuButton.setAttribute("aria-expanded", "false");
    scrim.hidden = true;
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    scrim.hidden = !isOpen;
  });

  scrim.addEventListener("click", closeNavigation);
  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const current = link.getAttribute("href") === `#${visible.target.id}`;
        if (current) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -65%", threshold: [0, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
  }

  const requestedLanguage = new URL(window.location.href).searchParams.get("lang");
  const initialLanguage = requestedLanguage || (navigator.language.toLowerCase().startsWith("it") ? "it" : "en");
  setLanguage(initialLanguage, Boolean(requestedLanguage));
  document.getElementById("year").textContent = String(new Date().getFullYear());
  document.body.dataset.ready = "";
})();