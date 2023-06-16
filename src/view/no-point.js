import AbstractView from '../framework/view/abstract-view.js';
import { FILTER_TYPE } from '../const/filter';

const NoPointsTexts = {
  [FILTER_TYPE.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPE.PAST]: 'There are no past events now',
  [FILTER_TYPE.FUTURE]: 'There are no future events now',
};

const createNoPointTemplate = () => {
  const noTaskTextValue = NoPointsTexts[FILTER_TYPE];

  return (
    `<p class="trip-events__msg">${noTaskTextValue}</p>`
  );
}
export default class NoPoint extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
