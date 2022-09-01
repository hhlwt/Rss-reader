import onChange from 'on-change';
import { renderFeeds, renderPosts, renderModal } from './renderContent';

const handleProcessState = (elements, i18nInstance, state, value) => {
  switch (value) {
    case 'processing':
      elements.button.disabled = true;
      elements.input.classList.remove('is-invalid');
      elements.inputFeedback.classList.remove('text-danger', 'text-success');
      elements.inputFeedback.classList.add('text-info');
      elements.inputFeedback.textContent = i18nInstance.t('processing');
      elements.input.setAttribute('readonly', 'true');
      break;

    case 'processed':
      elements.inputFeedback.classList.remove('text-info');
      elements.inputFeedback.classList.add('text-success');
      elements.inputFeedback.textContent = i18nInstance.t('successValidate');
      elements.input.value = '';
      elements.input.focus();
      elements.input.removeAttribute('readonly');
      elements.button.disabled = false;
      break;

    case 'failed':
      elements.inputFeedback.classList.remove('text-info');
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
      return;
    }

    if (path === 'rssContent.feeds') {
      renderFeeds(elements, state, i18nInstance);
      return;
    }

    if (path === 'rssContent.posts') {
      renderPosts(elements, state, i18nInstance);
      return;
    }

    if (path === 'modal') {
      renderModal(elements, state);
    }
  });

  return watchedState;
};

export default makeObserver;
