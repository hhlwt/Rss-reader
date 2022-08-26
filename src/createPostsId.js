const createPostsId = (posts, initialId) => {
  let currentId = initialId;

  const identifiedPosts = posts.map(({ link, title, description }) => {
    const identifiedPost = {
      link, title, description, id: currentId,
    };
    currentId += 1;

    return identifiedPost;
  });
  return identifiedPosts;
};

export default createPostsId;
