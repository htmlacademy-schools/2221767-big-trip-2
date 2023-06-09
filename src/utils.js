import dayjs from 'dayjs';


const getRandomNumber = (min, max) => {
  if (min < max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

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
const isPointFuture = (pointDate) => dayjs(pointDate.dateFrom).isAfter(dayjs());

const getDateTime = (date) => dayjs(date).format('DD/MM/YY hh:mm');


export { getRandomNumber, getRandomArrayElement, updateItem, isEscKeyDown, getDateTime, isPointPast, isPointFuture};
