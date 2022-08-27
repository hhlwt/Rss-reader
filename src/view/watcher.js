import onChange from 'on-change';
import { renderFeeds, renderPosts } from './renderContent';

const renderModal = (elements, state) => {
  elements.modalTitle.textContent = state.modalState.title;
  elements.modalBody.textContent = state.modalState.body;
  elements.modalFullArcticle.setAttribute('href', state.modalState.fullArticleLink);
};

const handleProcessState = (elements, i18nInstance, state, value) => {
  switch (value) {
    case 'processing':
      elements.button.disabled = true;
      elements.input.classList.remove('is-invalid');
      elements.inputFeedback.classList.remove('text-danger', 'text-success');
      elements.inputFeedback.textContent = '';
      elements.input.setAttribute('readonly', 'true');
      break;

    case 'processed':
      renderFeeds(elements, state);
      renderPosts(elements, state);
      renderModal(elements, state);
      elements.inputFeedback.classList.add('text-success');
      elements.inputFeedback.textContent = i18nInstance.t('successValidate');
      elements.input.value = '';
      elements.input.focus();
      elements.input.removeAttribute('readonly');
      elements.button.disabled = false;
      break;

    case 'failed':
      if (state.validateErrorKey === 'invalidUrl' || state.validateErrorKey === 'urlAlreadyExists') {
        elements.input.classList.add('is-invalid');
      }
      elements.inputFeedback.classList.add('text-danger');
      elements.inputFeedback.textContent = i18nInstance.t(state.validateErrorKey);
      elements.input.removeAttribute('readonly');
      elements.button.disabled = false;
      break;

    default:
      break;
  }
};

const makeObserver = (state, elements, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'processState') {
      handleProcessState(elements, i18nInstance, state, value);
    }
  });

  return watchedState;
};

export default makeObserver;
