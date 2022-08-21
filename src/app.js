import { setLocale, string } from 'yup';
import i18n from 'i18next';
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
    };

    const state = {
      urls: [],
      validateErrorKey: null,
    };

    const watchedState = makeObserver(state, elements, i18nInstance);

    setLocale({
      mixed: {
        notOneOf: () => ({ key: 'urlAlreadyExists' }),
      },
      string: {
        url: () => ({ key: 'invalidUrl' }),
      },
    });

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = elements.input.value;
      const schema = string().url().notOneOf(watchedState.urls);
      schema.validate(url)
        .then((newUrl) => {
          watchedState.urls.push(newUrl);
          watchedState.validateErrorKey = '';
        })
        .catch((schemaEror) => {
          const [{ key }] = schemaEror.errors;
          watchedState.validateErrorKey = key;
          throw new Error(i18nInstance.t(key));
        });
    });
  });
};
