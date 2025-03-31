import { AxiosInstance } from "axios";

const MAX_PAGE_SIZE = 200
export const autoPaginationGraphqlRequest = async <T>(
  query: string,
  responseKey: string,
  http: AxiosInstance,
  { offset = 0, orderBy = "UID", ...variables }: any = {}
) => {
  let fetchOnePage = async (offset: number) => {
    let { data: resData } = await http.post("/graphql/graphql", {
      query,
      variables: {
        ...variables,
        orderBy,
        offset,
        first: MAX_PAGE_SIZE
      }
    });
    console.log(resData)
    let {
      data: {
        [responseKey]: { totalCount = 0, edges: data = [] }
      },
      errors
    } = resData;

    return {
      totalCount,
      data: (data as { node: T }[]).map(({ node }) => node),
      errors
    };
  };

  let { totalCount, data: firstPageDatas, errors } = await fetchOnePage(
    offset
  );

  if (errors) {
    throw errors;
  }

  // parallel load all subsequence page
  let remainingPage = Math.max(
    Math.ceil((totalCount - offset) / MAX_PAGE_SIZE) - 1,
    0
  );
  let subsequenceData = (
    await Promise.all(
      [...new Array(remainingPage)].map((item, index) =>
        fetchOnePage(offset + (index + 1) * MAX_PAGE_SIZE)
      )
    )
  ).flatMap(resp => resp.data);

  return [...firstPageDatas, ...subsequenceData]
};