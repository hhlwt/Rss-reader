import onChange from 'on-change';

const handleError = (elements, value, prevValue) => {
  if (!value && !prevValue) return;

  if (value && !prevValue) {
    elements.input.classList.add('is-invalid');
    return;
  }

  if (!value && prevValue) {
    elements.input.classList.remove('is-invalid');
  }
};

const render = (elements) => (path, value, prevValue) => {
  switch (path) {
    case 'validateError':
      handleError(elements, value, prevValue);
      break;

    case 'urls':
      elements.input.value = '';
      elements.input.focus();
      break;

    default:
      break;
  }
};

const makeObserver = (state, elements) => {
  const watchedState = onChange(state, render(elements));
  return watchedState;
};

export default makeObserver;
