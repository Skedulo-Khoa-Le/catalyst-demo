const getFilterStartEndInsideRange = (begin: string, finish: string) => {
  const firstCase = [`StartDate >= ${begin}`, `StartDate <= ${finish}`];
  const secondCase = [`EndDate >= ${begin}`, `EndDate <= ${finish}`];
  const thirdCase = [`StartDate <= ${begin}`, `EndDate >= ${finish}`];

  return `(${firstCase.join(" AND ")}) OR (${secondCase.join(
    " AND "
  )}) OR (${thirdCase.join(" AND ")})`;
};

export default getFilterStartEndInsideRange;
