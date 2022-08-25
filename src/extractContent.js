export const extractFeed = (xmlContent) => {
  const title = xmlContent.querySelector('channel > title').textContent;
  const description = xmlContent.querySelector('channel > description').textContent;
  return { title, description };
};

export const extractPosts = (xmlContent) => {
  const items = xmlContent.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;

    return { link, title, description };
  });

  return posts;
};
