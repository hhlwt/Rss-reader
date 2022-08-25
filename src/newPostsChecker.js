import _ from 'lodash';
import axios from 'axios';
import parseData from './parser';
import { extractPosts } from './extractContent';

const proxifyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const checkNewPosts = (watcher, state) => {
  setTimeout(() => {
    const postGroupPromises = state.urls.map((url) => {
      const promise = axios.get(proxifyUrl(url))
        .then((response) => {
          const responseContent = response.data.contents;
          const xmlContent = parseData(responseContent);
          const posts = extractPosts(xmlContent);
          return posts;
        }).catch();
      return promise;
    });
    Promise.all(postGroupPromises).then((fulfieldGroups) => {
      const updatedPosts = _.flatten(fulfieldGroups);
      const oldPosts = state.rssContent.posts;

      const newPosts = _.pullAllWith(updatedPosts, oldPosts, _.isEqual);
      if (newPosts.length !== 0) {
        newPosts.forEach((post) => watcher.rssContent.posts.unshift(post));
        watcher.processState = 'processed';
        watcher.processState = 'filling';
      }
    });
    checkNewPosts(watcher, state);
  }, 5000);
};

export default checkNewPosts;
