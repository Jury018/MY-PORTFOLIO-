document.addEventListener('DOMContentLoaded', () => {
  const certificateIcons = document.querySelectorAll('.certificate-icon');
  let currentIndex = -1;

  // Open Lightbox
  window.openLightbox = function(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    currentIndex = Array.from(certificateIcons).indexOf(imgElement);

    lightboxImage.src = imgElement.src;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  // Close Lightbox
  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scroll
  };

  // Navigate Lightbox
  window.navigateLightbox = function(direction) {
    if (currentIndex === -1) return;
    currentIndex = (currentIndex + direction + certificateIcons.length) % certificateIcons.length;
    document.getElementById('lightbox-image').src = certificateIcons[currentIndex].src;
  };

  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'Escape') closeLightbox();
  });
});
