import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPE } from '../const/sort';

const createSortTemplate = (currentSortType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.DAY}">
      <input ${currentSortType === SORT_TYPE.DAY ? 'checked' : ''} id="sort-${SORT_TYPE.DAY}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${SORT_TYPE.DAY}" data-sort-type="${SORT_TYPE.DAY}" checked>
        <label class="trip-sort__btn" for="sort-${SORT_TYPE.DAY}">Day</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--event">
      <input ${currentSortType === SORT_TYPE.EVENT ? 'checked' : ''} id="sort-${SORT_TYPE.EVENT}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${SORT_TYPE.EVENT}" data-sort-type=${SORT_TYPE.EVENT} disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.TIME}">
      <input ${currentSortType === SORT_TYPE.TIME ? 'checked' : ''} id="sort-${SORT_TYPE.TIME}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${SORT_TYPE.TIME}" data-sort-type="${SORT_TYPE.TIME}">
        <label class="trip-sort__btn" for="sort-${SORT_TYPE.TIME}">Time</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--${SORT_TYPE.PRICE}">
      <input ${currentSortType === SORT_TYPE.PRICE ? 'checked' : ''} id="sort-${SORT_TYPE.PRICE}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${SORT_TYPE.PRICE}" data-sort-type="${SORT_TYPE.PRICE}">
        <label class="trip-sort__btn" for="sort-${SORT_TYPE.PRICE}">Price</label>
    </div>
    <div class="trip-sort__item  trip-sort__item--offer">
      <input ${currentSortType === SORT_TYPE.OFFER ? 'checked' : ''} id="sort-${SORT_TYPE.OFFER}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${SORT_TYPE.OFFER}" data-sort-type=${SORT_TYPE.OFFER} disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`
);

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

}
