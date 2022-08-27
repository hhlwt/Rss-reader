import { string } from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import makeObserver from './view/watcher';
import ru from './locales/ru';
import parseData from './parser';
import { extractFeed, extractPosts } from './extractContent';
import checkNewPosts from './newPostsChecker';
import createPostsId from './createPostsId';

const proxifyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

export default () => {
  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const elements = {
    form: document.querySelector('form'),
    button: document.querySelector('.rss-form .btn-primary'),
    input: document.querySelector('#url-input'),
    inputFeedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFullArcticle: document.querySelector('.full-article'),
  };

  const state = {
    processState: 'filling',
    modalState: {
      title: null,
      body: null,
      fullArticleLink: null,
    },
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
        const responseContent = response.data.contents;
        const xmlContent = parseData(responseContent);
        const newFeed = extractFeed(xmlContent);
        const newPosts = extractPosts(xmlContent);
        const identifiedNewPosts = createPostsId(newPosts, state.rssContent.posts.length);
        watchedState.rssContent.feeds.unshift(newFeed);
        watchedState.rssContent.posts.unshift(...identifiedNewPosts);
        watchedState.urls.push(inputUrl);
        watchedState.validateErrorKey = '';
        watchedState.processState = 'processed';
        watchedState.processState = 'filling';
      })
      .catch((error) => {
        if (error.message === 'Network Error') {
          watchedState.validateErrorKey = 'networkError';
        } else {
          watchedState.validateErrorKey = error.message;
        }

        watchedState.processState = 'failed';
        watchedState.processState = 'filling';
      });
  });

  checkNewPosts(watchedState, state);
};
