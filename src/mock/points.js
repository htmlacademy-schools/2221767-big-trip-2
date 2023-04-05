import { getRandomInteger } from '../utils.js';
import dayjs from 'dayjs';

export const ELEMENTS_COUNT = {
  MIN: 1,
  MAX: 6,
};
export const PICTURE_NUMBER = {
  MIN: 0,
  MAX: 10,
};
export const PRICE = {
  MIN: 100,
  MAX: 3000,
};

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DESTINATION_NAMES = ['Amsterdam', 'Chamonix', 'Geneva', 'Ekaterinburg', 'Moscow'];

const DESCRIPTIONS = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const generateDescription = () => {
  let description = '';
  for (let i = 0; i < getRandomInteger(ELEMENTS_COUNT.MIN, ELEMENTS_COUNT.MAX); i++) {
    description += ` ${
      DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)]
    }`;
  }
  return description;
};

const generatePicture = () => ({
  src: `http://picsum.photos/248/152?r=${getRandomInteger(PICTURE_NUMBER.MIN, PICTURE_NUMBER.MAX)}`,
  description: generateDescription(),
});

const generateDestination = (id) => ({
  id,
  description: generateDescription(),
  name: DESTINATION_NAMES[id],
  pictures: Array.from(
    { length: getRandomInteger(ELEMENTS_COUNT.MIN, ELEMENTS_COUNT.MAX) },
    generatePicture
  ),
});

const getDestinations = () =>
  Array.from({ length: DESTINATION_NAMES.length }).map((value, index) =>
    generateDestination(index)
  );

const generateOffer = (id, pointType) => ({
  id,
  title: `offer for ${pointType}`,
  price: getRandomInteger(PRICE.MIN, PRICE.MAX),
});

const generateOffersByType = (pointType) => ({
  type: pointType,
  offers: Array.from({
    length: getRandomInteger(ELEMENTS_COUNT.MIN, ELEMENTS_COUNT.MAX),}).map((value, index) => generateOffer(index + 1, pointType)),
});

const getOffersByType = () =>
  Array.from({ length: POINT_TYPES.length }).map((value, index) => generateOffersByType(POINT_TYPES[index])
  );

export const offers = getOffersByType();
export const destinations = getDestinations();

export const generatePoint = (pointId) => {
  const offersByTypePoint = offers[getRandomInteger(0, offers.length - 1)];
  const offerIdsByTypePoint = offersByTypePoint.offers.map((offer) => offer.id);
  return {
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
    dateFrom: dayjs()
      .add(getRandomInteger(-3, 0), 'day')
      .add(getRandomInteger(-2, 0), 'hour')
      .add(getRandomInteger(-59, 0), 'minute'),
    dateTo: dayjs()
      .add(getRandomInteger(0, 2), 'hour')
      .add(getRandomInteger(0, 59), 'minute'),
    destinationId: destinations[getRandomInteger(0, destinations.length - 1)].id,
    id: pointId,
    isFavorite: Boolean(getRandomInteger()),
    offerIds: Array.from({
      length: getRandomInteger(0, offerIdsByTypePoint.length),}).map(() =>
      offerIdsByTypePoint[getRandomInteger(0, offerIdsByTypePoint.length - 1)]
    ),
    type: offersByTypePoint.type,
  };
};

