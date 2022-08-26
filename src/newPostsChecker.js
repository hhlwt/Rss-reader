import _ from 'lodash';
import axios from 'axios';
import parseData from './parser';
import { extractPosts } from './extractContent';
import createPostsId from './createPostsId';

const proxifyUrl = (url) => `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;

const comparePostsByLink = (updatedPosts, oldPosts) => {
  const newPosts = updatedPosts.filter((post) => {
    const isOldPost = oldPosts.some(({ link }) => post.link === link);
    return !isOldPost;
  });
  return newPosts;
};

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
    Promise.all(postGroupPromises).then((fulfilledGroups) => {
      const updatedPosts = _.flatten(fulfilledGroups);
      const oldPosts = state.rssContent.posts;

      const newPosts = comparePostsByLink(updatedPosts, oldPosts);
      if (newPosts.length !== 0) {
        const identifiedNewPosts = createPostsId(newPosts, state.rssContent.posts.length);
        identifiedNewPosts.forEach((post) => watcher.rssContent.posts.unshift(post));
        watcher.processState = 'processed';
        watcher.processState = 'filling';
      }
    });
    checkNewPosts(watcher, state);
  }, 5000);
};

export default checkNewPosts;
