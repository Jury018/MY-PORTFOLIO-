export function topNav() {
  const topNav = document.querySelector("nav.top-nav");
  if (!topNav) return; 

  const sections = document.querySelectorAll(".section-container section");
  const allNavItems = document.querySelectorAll("nav.top-nav li");
  const topNavHeight = topNav.offsetHeight;

  / Set scroll padding dynamically
  document.documentElement.style.setProperty(
    "--scroll-padding",
    `${topNavHeight + 30}px`
  );

  // Function to reset active states
  const resetActiveState = () => {
    allNavItems.forEach((navItem) => {
      navItem.querySelector(".nav-icon")?.classList.remove("active");
    });
  };

  // Intersection Observer for active state detection
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = entry.target.classList[1];

          resetActiveState();

          const matchingNav = [...allNavItems].find((navItem) =>
            navItem.classList.contains(sectionClass)
          );

          if (matchingNav) {
            matchingNav.querySelector(".nav-icon")?.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: `-${topNavHeight}px 0px 0px 0px`, // Adjust based on header height
      threshold: 0.5,
    }
  );

  // Observe sections
  sections.forEach((section) => sectionObserver.observe(section));

  /** 🔹 Tooltip Handling */
  allNavItems.forEach((navItem) => {
    const tooltip = navItem.querySelector("a p");
    if (!tooltip) return;

    navItem.addEventListener("mouseenter", () => {
      tooltip.style.display = "block";
      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateX(-50%) scale(1)";
      });
    });

    navItem.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
      tooltip.style.transform = "translateX(-50%) scale(0)";
      setTimeout(() => (tooltip.style.display = "none"), 200);
    });
  });
}