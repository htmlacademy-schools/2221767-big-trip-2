import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { POINT_TYPES } from '../const/point-types';
import { getDateTime } from '../utils';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 100,
  dateFrom: dayjs(),
  dateTo: dayjs().add(7, 'day'),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: POINT_TYPES.TAXI
};

const generatePictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture['src']}" alt="${picture.description}">`;
  });
  return result;
};

const generateDestinations = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result = `${result}
   <option value="${destination.name}"></option>`;
  });
  return result;
};
const generateOffers = (allOffers, checkedOffers, isDisabled) => {
  let result = '';
  allOffers.forEach((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
    result = `${result}
    <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked} ${isDisabled ? 'disabled' : ''}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};
const generateDate = (dateFrom, dateTo, isDisabled) => (
  `<div class="event__field-group  event__field-group--time">
   <label class="visually-hidden" for="event-start-time-1">From</label>
   <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}" ${isDisabled ? 'disabled' : ''}>

   &mdash;
   <label class="visually-hidden" for="event-end-time-1">To</label>
   <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}" ${isDisabled ? 'disabled' : ''}>   </div>`
);

const generateType = (currentType, isDisabled) => Object.values(POINT_TYPES).map((type) =>
  `<div class="event__type-item">
   <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}${isDisabled ? 'disabled' : ''}>
   <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
   </div>`).join('');

const createEditFormTemplate = (point, destinations, allOffers, isNewPoint) => {
  const { basePrice, type, destination, dateFrom, dateTo, offers, isDisabled, isSaving, isDeleting } = point;
  const offersByType = allOffers.find((offer) => offer.type === type);
  const currentDestination = destinations.find((item) => item.id === destination);

  return (`<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${generateType(type, isDisabled)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${destination}">
          ${type}
        </label>
        <input class="event__input event__input--destination" id="event-destination-${destination}" type="text" name="event-destination" value="${currentDestination ? currentDestination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
        <datalist id="destination-list-1"${isDisabled ? 'disabled' : ''}>
        ${generateDestinations(destinations)}
        </datalist>
      </div>
        ${generateDate(dateFrom, dateTo, isDisabled)}
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
      </div>
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      ${isNewPoint ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>` :
    `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
       <button class="event__rollup-btn" type="button">`}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${generateOffers(offersByType.offers, offers, isDisabled)}
        </div>
      </section>
       ${currentDestination ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${currentDestination.description}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${generatePictures(currentDestination.pictures)}
          </div>
        </div>
      </section>
    </section>` : ''}
  </form>
</li>`);
};

export default class PointEdit extends AbstractStatefulView {
  #destination = null;
  #offers = null;
  #isNewPoint = null;
  #offersByType = null;

  #datepicker = null;
  #dateTo = null;

  constructor({ point = BLANK_POINT, destination, offers, isNewPoint }) {
    super();
    this._state = PointEdit.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;
    this.#offersByType = this.#offers.find((offer) => offer.type === this._state.type);
    this.#isNewPoint = isNewPoint;
    this._restoreHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destination, this.#offers, this.#isNewPoint);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseStateToPoint(this._state));
  };


  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEdit.parseStateToPoint(this._state));
  };

  reset = (point) => {
    this.updateElement(PointEdit.parsePointToState(point));
  };

  #setDateFromPicker() {
    if (this._state.dateFrom) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          time24hr: true,
          defaultDate: this._state.dateFrom,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
  }

  #setDateToPicker() {
    if (this._state.dateTo) {
      this.#datepicker = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          time24hr: true,
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#dateToChangeHandler,
        },
      );
    }
  }

  #dateFromChangeHandler = ([userDate]) => {
    if (this.#dateTo < userDate) {
      this.updateElement({
        dateFrom: userDate,
        dateTo: userDate
      });
      return;
    }
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
    this.#dateTo = userDate;
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  #typePointChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.offers = [];
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destination.find((d) => d.name === evt.target.value);
    this.updateElement({
      destination: destination.id,
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.offers.filter((n) => n !== Number(evt.target.id.slice(-1)));
    let currentOffers = [...this._state.offers];
    if (offers.length !== this._state.offers.length) {
      currentOffers = offers;
    }
    else {
      currentOffers.push(Number(evt.target.id.slice(-1)));
    }
    this._setState({
      offers: currentOffers
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#typePointChangeHandler);
    if (this.#offersByType && this.#offersByType.offers.length > 0) {
      this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    }
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setCloseClickHandler(this._callback.closeClick);
    }
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  static parsePointToState = (point) => ({
    ...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate(),
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  };


  _restoreHandlers() {
    return undefined;
  }
}
