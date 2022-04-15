import { MODAL_CLOSE_SEC } from '../config';

class HeroView {
  _parentElement = document.querySelector('.hero');

  renderAnimation() {
    window.addEventListener('load', () => {
      this._parentElement.querySelector(
        '.hero__content--heading'
      ).style.filter = 'blur(0)';

      this._parentElement.querySelector(
        '.hero__content--heading'
      ).style.letterSpacing = '0';
    });
  }

  renderErrorPopup(msg) {
    const errorPopup = this._parentElement.querySelector('.hero__error-popup');
    errorPopup.textContent = msg;
    errorPopup.style.opacity = 1;
    errorPopup.style.transform = 'scale(1)';

    setTimeout(() => {
      errorPopup.style.opacity = 0;
      errorPopup.style.transform = 'scale(0)';
    }, MODAL_CLOSE_SEC * 1000);
  }
}

export default new HeroView();
