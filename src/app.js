import { string } from 'yup';
import _ from 'lodash';
import i18n from 'i18next';
import axios from 'axios';
import makeObserver from './view/watcher';
import ru from './locales/ru';
import parseData from './parser';
import proxifyUrl from './proxifyUrl';
import checkNewPosts from './newPostsChecker';

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
    uiState: {
      readPostsIds: [],
      modal: {},
    },
    processState: 'filling',
    urls: [],
    validateErrorKey: null,
    rssContent: {
      feeds: [],
      posts: [],
    },
  };

  const watchedState = makeObserver(state, elements, i18nInstance);

  elements.postsContainer.addEventListener('click', (e) => {
    const articleId = e.target.dataset.id;
    if (!articleId) return;
    const clickedPost = state.rssContent.posts.find(({ id }) => id === articleId);
    watchedState.uiState.readPostsIds.push(articleId);
    watchedState.uiState.modal = {
      clickedPostElement: document.querySelector(`a[data-id="${articleId}"]`),
      title: clickedPost.title,
      description: clickedPost.description,
      link: clickedPost.link,
    };
  });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.processState = 'processing';
    const inputUrl = elements.input.value;
    const schema = string().url('invalidUrl').notOneOf(watchedState.urls, 'urlAlreadyExists');
    schema.validate(inputUrl)
      .then((url) => {
        const proxifedUrl = proxifyUrl(url);

        return axios.get(proxifedUrl);
      })
      .then((response) => {
        const responseContent = response.data.contents;
        const { newFeed, newPosts } = parseData(responseContent);
        const identifiedNewPosts = newPosts.map((post) => {
          post.id = _.uniqueId();
          return post;
        });
        watchedState.rssContent.feeds.unshift(newFeed);
        watchedState.rssContent.posts.unshift(...identifiedNewPosts);
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

  checkNewPosts(watchedState);
};
