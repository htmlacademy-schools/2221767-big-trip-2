import { render, replace, remove } from '../framework/render.js';
import PointEdit from '../view/point-edit';
import PointRoute from '../view/point-route';
import { isEscKeyDown } from '../utils';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {

  #point = null;
  #mode = Mode.DEFAULT;

  #pointsList = null;
  #changeData = null;
  #changeMode = null;

  #pointRouteComponent = null;
  #pointEditComponent = null;

  #pointsModel = null;
  #destinations = null;
  #offers = null;

  constructor(pointsList, pointsModel, changeData, changeMode) {
    this.#pointsList = pointsList;
    this.#pointsModel = pointsModel;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = [...this.#pointsModel.offers];

    const prevPointRouteComponent = this.#pointRouteComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointRouteComponent = new PointRoute(point, this.#destinations, this.#offers);
    this.#pointEditComponent = new PointEdit(point, this.#destinations, this.#offers);

    this.#pointRouteComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointRouteComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);

    if (prevPointRouteComponent === null || prevPointEditComponent === null) {
      render(this.#pointRouteComponent, this.#pointsList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointRouteComponent, prevPointRouteComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointRouteComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointRouteComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointRouteComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointRouteComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();

  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceFormToPoint();

  };

  #handleCloseClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();

  };

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

}
