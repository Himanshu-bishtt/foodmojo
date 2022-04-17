class HtmlView {
  _parentElement = document.querySelector('html');

  changeTheme(handler) {
    let theme;
    const themePicker = this._parentElement.querySelector(
      '.btn__theme--select'
    );

    themePicker.addEventListener('change', () => {
      this._parentElement.setAttribute('data-theme', themePicker.value);
      theme = themePicker.value;
      handler(theme);
    });
  }
}

export default new HtmlView();
