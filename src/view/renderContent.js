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

    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    a.classList.add('fw-bold');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');

    a.setAttribute('href', post.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');

    a.textContent = post.title;
    button.textContent = 'Просмотр';

    li.replaceChildren(a, button);
    return li;
  });

  cardBody.replaceChildren(cardTitle);
  feedsList.replaceChildren(...posts);
  card.replaceChildren(cardBody, feedsList);
  elements.postsContainer.replaceChildren(card);
};
