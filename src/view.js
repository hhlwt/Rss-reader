import onChange from 'on-change';

const render = (elements) => (path, value, prevValue) => {
  if (path === 'isValidUrl') {
    if (value === false && prevValue === true) {
      elements.input.classList.add('is-invalid');
      return;
    }

    if (value === false && prevValue === false) {
      return;
    }

    if (value === true && prevValue === false) {
      elements.input.classList.remove('is-invalid');
    }
  }

  if (path === 'urls') {
    elements.input.value = '';
    elements.input.focus();
  }
};

const makeObserver = (state, elements) => {
  const watchedState = onChange(state, render(elements));
  return watchedState;
};

export default makeObserver;
