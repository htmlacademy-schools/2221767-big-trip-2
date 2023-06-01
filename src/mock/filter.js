import {filter} from "../utils";

const FILTER_TYPE = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

export const generateFilter = (points) => Object.entries(filter).map(
  ([filterName, filterPoints]) => ({
    name: filterName,
    count: filterPoints(points).length,
  }),
);

export {FILTER_TYPE}
