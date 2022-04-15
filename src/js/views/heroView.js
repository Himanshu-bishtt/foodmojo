import { MODAL_CLOSE_SEC } from '../config';
import icons from '../../icons/icons.svg';

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

  renderSpinner() {
    this._parentElement.querySelector('.hero__form--location').innerHTML = '';
    const spinner = `
      <svg class="hero__form--spinner">
        <use href="${icons}#icon-loader"></use>
      </svg>
    `;
    this._parentElement
      .querySelector('.hero__form--location')
      .insertAdjacentHTML('afterbegin', spinner);
  }

  renderUserLocation() {
    this._parentElement.querySelector('.hero__form--location').innerHTML = '';
    const html = `
      <img src="/location-48.5100a1b2.png" alt="location icon" />
      <p class="hero__form--location-user">Noida, India</p>
    `;
    this._parentElement
      .querySelector('.hero__form--location')
      .insertAdjacentHTML('beforeend', html);
  }

  addHandlerLocation(handler) {
    const detectLocationBtn = this._parentElement.querySelector(
      '.hero__form--location-btn'
    );

    detectLocationBtn.addEventListener('click', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new HeroView();
