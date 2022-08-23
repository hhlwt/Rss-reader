import { string } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import makeObserver from './view';
import ru from './locales/ru';
import parseData from './parser';

const proxifyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

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
      button: document.querySelector('.rss-form .btn-primary'),
      input: document.querySelector('#url-input'),
      inputFeedback: document.querySelector('.feedback'),
      postsContainer: document.querySelector('.posts'),
      feedsContainer: document.querySelector('.feeds'),
    };

    const state = {
      processState: 'filling',
      urls: [],
      validateErrorKey: null,
      rssContent: {
        feeds: [],
        posts: [],
      },
    };

    const watchedState = makeObserver(state, elements, i18nInstance);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.processState = 'processing';
      const inputUrl = elements.input.value;
      const schema = string().url('invalidUrl').notOneOf(watchedState.urls, 'urlAlreadyExists');
      schema.validate(inputUrl)
        .then((url) => axios.get(proxifyUrl(url)))
        .then((response) => {
          const urlContent = response.data.contents;
          const [newFeed, newPosts] = parseData(urlContent);
          watchedState.rssContent.feeds.push(newFeed);
          watchedState.rssContent.posts.push(...newPosts);
          watchedState.urls.push(inputUrl);
          watchedState.validateErrorKey = '';
          watchedState.processState = 'processed';
        })
        .catch((error) => {
          if (error.message === 'Network Error') {
            watchedState.validateErrorKey = 'networkError';
          } else {
            watchedState.validateErrorKey = error.message;
          }

          watchedState.processState = 'failed';
        });
    });
  });
};
