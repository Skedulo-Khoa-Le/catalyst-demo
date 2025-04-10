import useSWR from "swr";
import sdk from "../services/sdkGraphql";
import { ResourcesQueryVariables } from "../gql";

export default function useResources(variables?: ResourcesQueryVariables) {
  const { data, isLoading, error, status } = useSWR(
    `resources  ${JSON.stringify(variables)}`,
    () => sdk.resources(variables)
  );

  return { data, isLoading, error, status };
}
