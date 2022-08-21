import * as yup from 'yup';
import makeObserver from './view';

export default () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    button: document.querySelector('[type="submit"]'),
  };

  const state = {
    urls: [],
    validateError: null,
  };

  const watchedState = makeObserver(state, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.input.value;
    const schema = yup.string().url('Ссылка должна быть валидным URL').notOneOf(watchedState.urls, 'RSS уже существует');
    schema.validate(url)
      .then((newUrl) => {
        watchedState.urls.push(newUrl);
        watchedState.validateError = '';
      })
      .catch((schemaEror) => {
        watchedState.validateError = schemaEror.message;
        throw new Error(schemaEror);
      });
  });
};
