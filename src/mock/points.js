import dayjs from 'dayjs';
import { getRandomNumber, getRandomArrayElement } from '../utils';
const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const OFFER_TITLES = ['Upgrade to a business class', 'Order Uber', 'Add lunch', 'Order train'];

const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const DESTINATIONS_NAMES = ['Ekaterinburg', 'Geneva', 'Amsterdam', 'Moscow', 'Astana'];

const offerPrice = {
  MIN: 10,
  MAX: 50
};

const tripPrice = {
  MIN: 100,
  MAX: 3000
};

const createPicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomNumber(0, 10)}`,
  description: getRandomArrayElement(DESCRIPTIONS),
});

const createDestination = (id) => ({
  id,
  description: getRandomArrayElement(DESCRIPTIONS),
  name: getRandomArrayElement(DESTINATIONS_NAMES),
  pictures: Array.from({ length: getRandomNumber(2,5) }, createPicture)
});

const createOffer = (id) => ({
  id,
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomNumber(offerPrice.MIN, offerPrice.MAX)
});

const createOfferByType = (id) => ({
  id,
  type: getRandomArrayElement(POINT_TYPES),
  offers: Array.from({ length: getRandomNumber(2,5) }, createOffer)
});

const getRandomDate = () => dayjs()
  .add(getRandomNumber(1, 7), 'day')
  .add(getRandomNumber(1, 23), 'hour')
  .add(getRandomNumber(1, 59), 'minute');

const createRandomDates = () => {
  const date1 = getRandomDate();
  const date2 = getRandomDate();

  if (date1.isBefore(date2)) {
    return {
      dateFrom: date1.toISOString(),
      dateTo: date2.toISOString()
    };
  }
  return {
    dateFrom: date2.toISOString(),
    dateTo: date1.toISOString()
  };
};

const createPoint = (id) => {
  const randomDates = createRandomDates();
  return {
    basePrice: getRandomNumber(tripPrice.MIN, tripPrice.MAX),
    dateFrom: randomDates.dateFrom,
    dateTo: randomDates.dateTo,
    destination: createDestination(),
    id,
    isFavorite: Boolean(getRandomNumber(0, 1)),
    offers: createOfferByType(),
    type: getRandomArrayElement(POINT_TYPES)
  };
};

export { POINT_TYPES, OFFER_TITLES, DESCRIPTIONS, DESTINATIONS_NAMES, tripPrice, offerPrice, createPoint, createRandomDates };
