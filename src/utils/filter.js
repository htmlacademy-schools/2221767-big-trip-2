import { FILTER_TYPE } from '../const/filter';
import dayjs from 'dayjs';

const isPointPast = (pointDate) => dayjs(pointDate.dateFrom).isBefore(dayjs());
const isPointFuture = (pointDate) => dayjs(pointDate.dateFrom).isAfter(dayjs());

const filterFunction = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point))
};

export { filterFunction, isPointPast, isPointFuture };
