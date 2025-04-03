import { flow, trim, startCase, replace } from "lodash/fp"

export const graphQLSafeTransform = flow(
  trim,
  startCase,
  replace(/^([0-9])+/, 'X$&'),
  replace(/\s/g, '')
)