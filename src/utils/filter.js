import { FILTER_TYPE } from '../const/filter';
import { isPointPast, isPointFuture} from '../utils';

const filterFunction = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point))
};

export { filterFunction };
