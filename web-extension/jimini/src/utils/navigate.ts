const navigateTo = (to: string) => {
  window.parent.location.href = `${window.parent.origin}/${to}`;
};

export default navigateTo;
