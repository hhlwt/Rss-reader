import onChange from 'on-change';

const handleError = (elements, value, prevValue, i18nInstance) => {
  if (value === 'networkError') {
    elements.inputFeedback.textContent = i18nInstance.t(value);
    return;
  }

  if (!value && !prevValue) {
    elements.inputFeedback.classList.remove('text-danger');
    elements.inputFeedback.classList.add('text-success');
    elements.inputFeedback.textContent = i18nInstance.t('successValidate');
    return;
  }

  if (value && !prevValue) {
    elements.input.classList.add('is-invalid');
    elements.inputFeedback.classList.remove('text-success');
    elements.inputFeedback.classList.add('text-danger');
    elements.inputFeedback.textContent = i18nInstance.t(value);
    return;
  }

  if (!value && prevValue) {
    elements.input.classList.remove('is-invalid');
    elements.inputFeedback.classList.remove('text-danger');
    elements.inputFeedback.classList.add('text-success');
    elements.inputFeedback.textContent = i18nInstance.t('successValidate');
    return;
  }

  elements.inputFeedback.textContent = i18nInstance.t(value);
};

const render = (elements, i18nInstance) => (path, value, prevValue) => {
  switch (path) {
    case 'validateErrorKey':
      handleError(elements, value, prevValue, i18nInstance);
      break;

    case 'urls':
      elements.input.value = '';
      elements.input.focus();
      break;

    default:
      break;
  }
};

const makeObserver = (state, elements, i18nInstance) => {
  const watchedState = onChange(state, render(elements, i18nInstance));
  return watchedState;
};

export default makeObserver;
