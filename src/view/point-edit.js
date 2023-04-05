import { createElement } from '../render.js';
import { getDateTime } from '../utils.js';

const renderPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

const renderOffers = (offers, checkedOffers) => {
  let result = '';
  offers.forEach((offer) => {
    if (checkedOffers.includes(offer.id)) {
      result = `${result}<li class="event__offer"><span class="event__offer-title">${offer.title}</span>&plus;&euro;&nbsp;<span class="event__offer-price">${offer.price}</span></li>`;
    }
  });
  return result;
};

const renderType = (type) =>
  `<fieldset className="event__type-group">
    <legend className="visually-hidden">Event type</legend>
    <div className="event__type-item">
      <input id="event-type-taxi-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="taxi" ${'taxi' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--taxi" htmlFor="event-type-taxi-1">Taxi</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-bus-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="bus" ${'bus' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--bus" htmlFor="event-type-bus-1">Bus</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-train-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="train" ${'train' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--train" htmlFor="event-type-train-1">Train</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-ship-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="ship" ${'ship' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--ship" htmlFor="event-type-ship-1">Ship</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-drive-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="drive" ${'drive' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--drive" htmlFor="event-type-drive-1">Drive</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-flight-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="flight" ${'flight' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--flight" htmlFor="event-type-flight-1">Flight</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-check-in-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="check-in" ${'check-in' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--check-in"
               htmlFor="event-type-check-in-1">Check-in</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-sightseeing-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="sightseeing" ${'sightseeing' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--sightseeing"
               htmlFor="event-type-sightseeing-1">Sightseeing</label>
    </div>
    <div className="event__type-item">
      <input id="event-type-restaurant-1" className="event__type-input  visually-hidden" type="radio" name="event-type"
             value="restaurant" ${'restaurant' === type ? 'checked' : ''}>
        <label className="event__type-label  event__type-label--restaurant"
               htmlFor="event-type-restaurant-1">Restaurant</label>
    </div>
  </fieldset>`;


const createPointEditTemplate = (point, offers, destinations) => {
  const { basePrice, type, destinationId, dateFrom, dateTo, offerIds } = point;
  const pointTypeOffers = offers.find((offer) => offer.type === type);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
          ${renderType(type)}
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinations[destinationId].name}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">&mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          ${renderOffers(pointTypeOffers.offers, offerIds)}
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations[destinationId].description}</p>
          <div class="event__photos-container">
            <div class="event__photos-tape">
                ${renderPictures(destinations[destinationId].pictures)}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`);
};

export default class EditPointView {
  constructor(pointData, offers, destinations) {
    this.pointData = pointData;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createPointEditTemplate(
      this.pointData,
      this.offers,
      this.destinations
    );
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
