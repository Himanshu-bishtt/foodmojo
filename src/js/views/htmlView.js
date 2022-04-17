class HtmlView {
  _parentElement = document.querySelector('html');

  changeTheme(handler) {
    const themePicker = this._parentElement.querySelector(
      '.btn__theme--select'
    );

    themePicker.addEventListener('change', () => {
      this._parentElement.setAttribute('data-theme', themePicker.value);
      handler(themePicker.value);
    });
  }

  renderSavedTheme(theme) {
    this._parentElement.setAttribute('data-theme', theme);
    const themePicker = this._parentElement.querySelector(
      '.btn__theme--select'
    );
    themePicker.value = theme === 'dark' ? 'dark' : 'light';
  }
}

export default new HtmlView();
