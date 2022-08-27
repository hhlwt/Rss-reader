export const renderFeeds = (elements, state) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const feedsList = document.createElement('ul');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Фиды';
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  const feeds = state.rssContent.feeds.map((feed) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    h3.classList.add('h6', 'm-0');
    p.classList.add('m-0', 'small', 'text-black-50');

    h3.textContent = feed.title;
    p.textContent = feed.description;

    li.replaceChildren(h3, p);
    return li;
  });

  cardBody.replaceChildren(cardTitle);
  feedsList.replaceChildren(...feeds);
  card.replaceChildren(cardBody, feedsList);
  elements.feedsContainer.replaceChildren(card);
};

export const renderPosts = (elements, state) => {
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const feedsList = document.createElement('ul');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Посты';
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  const posts = state.rssContent.posts.map((post) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const button = document.createElement('button');
    const aClassList = post.read ? ['fw-normal', 'link-secondary'] : ['fw-bold'];

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    a.classList.add(...aClassList);
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('data-id', post.id);
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-id', post.id);

    a.textContent = post.title;
    button.textContent = 'Просмотр';

    a.addEventListener('click', (e) => {
      const articleId = Number(e.target.dataset.id);
      e.target.classList.remove('fw-bold');
      e.target.classList.add('fw-normal', 'link-secondary');
      const currentArticle = state.rssContent.posts.find((arcticle) => arcticle.id === articleId);
      currentArticle.read = true;
    });

    button.addEventListener('click', (e) => {
      const articleId = Number(e.target.dataset.id);
      const articleLinkElement = document.querySelector(`a[data-id="${articleId}"]`);
      articleLinkElement.classList.remove('fw-bold');
      articleLinkElement.classList.add('fw-normal', 'link-secondary');
      const currentArticle = state.rssContent.posts.find((arcticle) => arcticle.id === articleId);
      currentArticle.read = true;

      elements.modalTitle.textContent = currentArticle.title;
      elements.modalBody.textContent = currentArticle.description;
      elements.modalFullArcticle.setAttribute('href', currentArticle.link);
    });

    li.replaceChildren(a, button);
    return li;
  });

  cardBody.replaceChildren(cardTitle);
  feedsList.replaceChildren(...posts);
  card.replaceChildren(cardBody, feedsList);
  elements.postsContainer.replaceChildren(card);
};
