import _ from 'lodash';
import axios from 'axios';
import parseData from './parser';
import proxifyUrl from './proxifyUrl';

const comparePostsByLink = (updatedPosts, oldPosts) => {
  const newPosts = updatedPosts.filter((post) => {
    const isOldPost = oldPosts.some(({ link }) => post.link === link);

    return !isOldPost;
  });

  return newPosts;
};

const checkNewPosts = (watcher) => {
  const postGroupPromises = watcher.urls.map((url) => {
    const proxifedUrl = proxifyUrl(url);
    const promise = axios.get(proxifedUrl)
      .then((response) => {
        const responseContent = response.data.contents;
        const { newPosts } = parseData(responseContent);

        return newPosts;
      });

    return promise;
  });

  Promise.all(postGroupPromises)
    .then((fulfilledGroups) => {
      const updatedPosts = _.flatten(fulfilledGroups);
      const oldPosts = watcher.rssContent.posts;
      const newPosts = comparePostsByLink(updatedPosts, oldPosts);
      if (newPosts.length !== 0) {
        const identifiedNewPosts = newPosts.map((post) => {
          post.id = _.uniqueId();

          return post;
        });
        identifiedNewPosts.forEach((post) => watcher.rssContent.posts.unshift(post));
      }
    })
    .finally(() => setTimeout(() => checkNewPosts(watcher), 5000));
};

export default checkNewPosts;
