import AbstractView from '../framework/view/abstract-view';
import { SORT_TYPE } from '../mock/points';

const createSortTemplate = () => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.DAY}">
      <input id="sort-${SORT_TYPE.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${SORT_TYPE.DAY}"
             checked>
        <label class="trip-sort__btn" for="sort-day">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
             value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.TIME}">
      <input id="sort-${SORT_TYPE.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
             value="sort-${SORT_TYPE.TIME}">
        <label class="trip-sort__btn" for="sort-time">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.PRICE}">
      <input id="sort-${SORT_TYPE.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
             value="sort-${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="sort-price">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
             value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class Sort extends AbstractView {
  get template() {
    return createSortTemplate();
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}
