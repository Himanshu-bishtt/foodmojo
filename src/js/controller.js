'use strict';

window.addEventListener('load', function () {
  const heroHeading = this.document.querySelector('.hero__content--heading');

  heroHeading.style.filter = 'blur(0)';
  heroHeading.style.letterSpacing = '0';
});
