import onChange from 'on-change';

const handleError = (elements, value, i18nInstance) => {
  console.log(1);
  if (!value) {
    elements.input.classList.remove('is-invalid');
    elements.inputFeedback.classList.add('text-success');
    elements.inputFeedback.textContent = i18nInstance.t('successValidate');
  } else {
    elements.input.classList.add('is-invalid');
    elements.inputFeedback.classList.add('text-danger');
    elements.inputFeedback.textContent = i18nInstance.t(value);
  }
};

const handleProcessState = (elements, value) => {
  switch (value) {
    case 'processing':
      elements.button.disabled = true;
      elements.inputFeedback.classList.remove('text-danger', 'text-success');
      elements.inputFeedback.textContent = '';
      elements.input.setAttribute('readonly', 'true');
      break;

    case 'processed':
      elements.input.value = '';
      elements.input.focus();
      elements.input.removeAttribute('readonly');
      elements.button.disabled = false;
      break;

    case 'failed':
      elements.input.removeAttribute('readonly');
      elements.button.disabled = false;
      break;

    default:
      break;
  }
};

const render = (elements, i18nInstance) => (path, value) => {
  switch (path) {
    case 'validateErrorKey':
      handleError(elements, value, i18nInstance);
      break;

    case 'processState':
      handleProcessState(elements, value);
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
