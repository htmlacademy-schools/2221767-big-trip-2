import {FILTER_TYPE} from './mock/filter';
import dayjs from 'dayjs';

const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);

const getRandomArrayElement = (elements) => elements[getRandomNumber(0, elements.length - 1)];

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const isEscKeyDown = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const isPointPast = (pointDate) => dayjs(pointDate.dateFrom).isBefore(dayjs());
const isPointFuture = (pointDate) => dayjs(pointDate.dateTo).isAfter(dayjs());

const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,
  [FILTER_TYPE.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FILTER_TYPE.PAST]: (points) => points.filter((point) => isPointPast(point))
};

const sortByDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));

const sortByTime = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return timeA - timeB;
};

const sortByPrice = (pointA, pointB) => pointA.basePrice - pointB.basePrice;

export { getRandomNumber, getRandomArrayElement, updateItem, isEscKeyDown, filter, sortByDay, sortByTime, sortByPrice  };
