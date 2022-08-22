import { string } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import makeObserver from './view';
import ru from './locales/ru';

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => {
    const elements = {
      form: document.querySelector('form'),
      input: document.querySelector('#url-input'),
      button: document.querySelector('[type="submit"]'),
      inputFeedback: document.querySelector('.feedback'),
    };

    const state = {
      urls: [],
      validateErrorKey: null,
    };

    const watchedState = makeObserver(state, elements, i18nInstance);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputUrl = elements.input.value;
      const schema = string().url('invalidUrl').notOneOf(watchedState.urls, 'urlAlreadyExists');
      schema.validate(inputUrl)
        .then((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`))
        .then((response) => {
          if (response.data.status.http_code !== 200) {
            watchedState.validateErrorKey = 'invalidRss';
            return;
          }
          watchedState.urls.push(inputUrl);
          watchedState.validateErrorKey = '';
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            watchedState.validateErrorKey = 'networkError';
            return;
          }
          watchedState.validateErrorKey = error.message;
        });
    });
  });
};
