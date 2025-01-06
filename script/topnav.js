export function topNav() {
  const topNav = document.querySelector('nav.top-nav');

  // Set padding to avoid overlap when navigating to sections
  const topNavHeight = topNav.offsetHeight;
  document.documentElement.style.setProperty(
    '--scroll-padding',
    `${topNavHeight + 30}px`
  );

  const sections = document.querySelectorAll('.section-container section');
  const allNavItems = document.querySelectorAll('nav.top-nav li');

  // Function to reset active state
  const resetActiveState = () => {
    allNavItems.forEach((navItem) => {
      const navIcon = navItem.querySelector('.nav-icon');
      navIcon.classList.remove('active');
    });
  };

  // Intersection Observer to toggle active state
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionClass = entry.target.classList[1];

          // Reset all icons and activate the matching one
          resetActiveState();
          const matchingNav = Array.from(allNavItems).find((navItem) => {
            return navItem.classList.contains(sectionClass);
          });

          if (matchingNav) {
            const navIcon = matchingNav.querySelector('.nav-icon');
            navIcon.classList.add('active');
          }
        }
      });
    },
    {
      rootMargin: `-${topNavHeight}px 0px 0px 0px`, // Dynamic adjustment based on header height
      threshold: 0.5, // Trigger when 50% of the section is visible
    }
  );

  // Observe all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}