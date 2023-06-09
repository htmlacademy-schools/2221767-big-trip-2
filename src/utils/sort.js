import dayjs from 'dayjs';
import {SORT_TYPE} from '../mock/sort';

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByTime = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return timeA - timeB;
};

const sortByPrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

const sorting = {
  [SORT_TYPE.DAY]: (points) => points.sort(sortByDay),
  [SORT_TYPE.TIME]: (points) => points.sort(sortByTime),
  [SORT_TYPE.PRICE]: (points) => points.sort(sortByPrice),
};

export {sortByDay, sortByTime, sortByPrice, sorting}
