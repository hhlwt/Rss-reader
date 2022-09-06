const getContentSubContainers = (contentName, i18nInstance) => {
  if (document.querySelector(`.${contentName} card`)) {
    return document.querySelector(`.${contentName} list-group`);
  }

  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h2');
  const contentList = document.createElement('ul');

  card.classList.add('card', 'border-0');
  cardBody.classList.add('card-body');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = contentName === 'posts' ? i18nInstance.t('rssContent.postsTitle') : i18nInstance.t('rssContent.feedsTitle');
  contentList.classList.add('list-group', 'border-0', 'rounded-0');

  cardBody.replaceChildren(cardTitle);
  card.replaceChildren(cardBody, contentList);

  return [contentList, card];
};

export const renderFeeds = (elements, state, i18nInstance) => {
  const [feedsList, card] = getContentSubContainers('feeds', i18nInstance);

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

  feedsList.replaceChildren(...feeds);
  elements.feedsContainer.replaceChildren(card);
};

export const renderPosts = (elements, state, i18nInstance) => {
  const [postsList, card] = getContentSubContainers('posts', i18nInstance);

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
    button.textContent = i18nInstance.t('rssContent.postButton');

    li.replaceChildren(a, button);

    return li;
  });

  postsList.replaceChildren(...posts);
  elements.postsContainer.replaceChildren(card);
};

export const renderModal = (elements, state) => {
  state.modal.clickedPostElement.classList.remove('fw-bold');
  state.modal.clickedPostElement.classList.add('fw-normal', 'link-secondary');
  elements.modalTitle.textContent = state.modal.title;
  elements.modalBody.textContent = state.modal.description;
  elements.modalFullArcticle.setAttribute('href', state.modal.link);
};
