const createPostsId = (posts, initialId) => {
  let currentId = initialId;

  const identifiedPosts = posts.map(({
    link, title, description, read,
  }) => {
    const identifiedPost = {
      link, title, description, read, id: currentId,
    };
    currentId += 1;

    return identifiedPost;
  });
  return identifiedPosts;
};

export default createPostsId;
