import AbstractView from '../framework/view/abstract-view';
import { getDateTime } from '../utils/time';

const renderRoute = (points, destinations) => {
  if (points.length === 0) {
    return '';
  }
  const route = [points[0].destination];
  for (let i = 1; i < points.length; i++) {
    if (points[i].destination !== points[i - 1].destination) {
      route.push(points[i].destination);
    }
  }

  if (route.length > 3) {
    const startPoint = destinations.find((item) => item.id === route[0]);
    const endPoint = destinations.find((item) => item.id === route[route.length - 1]);
    return `${startPoint.name} &mdash; ... &mdash; ${endPoint.name}`;
  }

  return route.map((destination) => `${destinations.find((item) => item.id === destination).name}`).join(' &mdash; ');

};

const renderDatesRoute = (points) => {
  if (points.length === 0) {
    return '';
  }
  const start = getDateTime(points[0].dateFrom);
  const end = getDateTime(points[points.length - 1].dateTo);
  return `${start}&nbsp;&mdash;&nbsp;${end}`;
};

const renderPriceRoute = (points, offers) => {
  if (points.length === 0) {
    return '';
  }
  let totalPrice = 0;
  points.forEach((point) => {

    if (offers.length === 0) {
      return 0;
    }
    let priceOffers = 0;
    const offersByType = offers.find((offer) => offer.type === point.type);
    const pointOffers = point.offers;
    pointOffers.forEach((offer) => {
      priceOffers += offersByType.offers.find((item) => item.id === offer).price;
    });
    totalPrice += point.basePrice;
    totalPrice += priceOffers;
  });
  return `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>`;
};

const createTripInfoTemplate = (points, destinations, offers) => {
  if (destinations.length === 0 || offers.length === 0) {
    return '';
  }
  return `
  <div class="trip-info"><div class="trip-info__main">
    <h1 class="trip-info__title">${renderRoute(points, destinations)}</h1>
    <p class="trip-info__dates">${renderDatesRoute(points)}</p>
  </div>
  <p class="trip-info__cost">
    ${renderPriceRoute(points, offers)}
  </p>
</div>`;
};

export default class TripInfo extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
