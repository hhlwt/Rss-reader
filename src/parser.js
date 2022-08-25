export default (content) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(content, 'text/xml');

  if (parsedData.querySelector('parsererror')) {
    throw new Error('invalidRss');
  }

  return parsedData;
};
