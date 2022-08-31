const extractPosts = (xmlContent) => {
  const items = xmlContent.querySelectorAll('channel > item');
  const posts = Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;

    return {
      link, title, description, read: false,
    };
  });

  return posts;
};

const extractFeed = (xmlContent) => {
  const title = xmlContent.querySelector('channel > title').textContent;
  const description = xmlContent.querySelector('channel > description').textContent;
  return { title, description };
};

export default (content) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(content, 'text/xml');

  if (parsedData.querySelector('parsererror')) {
    throw new Error('invalidRss');
  }

  return { newFeed: extractFeed(parsedData), newPosts: extractPosts(parsedData) };
};
