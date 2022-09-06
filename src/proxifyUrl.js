export default (url) => {
  const proxifedUrl = new URL('https://allorigins.hexlet.app/get');
  proxifedUrl.searchParams.set('disableCache', 'true');
  proxifedUrl.searchParams.set('url', url);

  return proxifedUrl;
};
