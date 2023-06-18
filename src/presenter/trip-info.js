import { render, remove } from '../framework/render';
import TripInfo from '../view/trip-info';
export default class TripInfoPresenter {
  #points = null;
  #destinations = null;
  #offers = null;

  #tripInfoComponent = null;
  #tripInfoContainer = null;

  #destinationsModel = null;
  #offersModel = null;

  constructor(tripInfoContainer, destinationsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (points) => {
    this.#points = points;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#tripInfoComponent = new TripInfo(this.#points, this.#destinations, this.#offers);

    render(this.#tripInfoComponent, this.#tripInfoContainer);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };
}
