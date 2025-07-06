export const divRemove = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
};

export const divRemoveAll = (selector) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => element.remove());
};