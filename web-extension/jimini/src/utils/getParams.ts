export const getQueryParamsValue = (key: string) => {
  const queryString = window.location.search || window.parent.location.search;
  const params = new URLSearchParams(queryString);
  return params.get(key) || "";
};

export default getQueryParamsValue;
