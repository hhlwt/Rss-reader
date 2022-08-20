import * as yup from 'yup';
import makeObserver from './view';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('[type="submit"]'),
  };

  const state = {
    isValidUrl: true,
    urls: [],
    errors: {},
  };

  const watchedState = makeObserver(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;
    const schema = yup.string().url().notOneOf(watchedState.urls);
    schema.validate(url)
      .then((newUrl) => {
        watchedState.urls.push(newUrl);
        watchedState.isValidUrl = true;
      })
      .catch(() => {
        watchedState.isValidUrl = false;
      });
  });
};
