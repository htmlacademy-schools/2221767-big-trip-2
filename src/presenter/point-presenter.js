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

  #pointsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointRouteComponent = null;
  #pointEditComponent = null;

  constructor(pointsListContainer, changeData, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointRouteComponent = this.#pointRouteComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointRouteComponent = new PointRoute(point);
    this.#pointEditComponent = new PointEdit(point);

    this.#pointRouteComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointRouteComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);

    if (prevPointRouteComponent === null || prevPointEditComponent === null) {
      render(this.#pointRouteComponent, this.#pointsListContainer);
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
    if (isEscKeyDown) {
      evt.preventDefault();
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
    this.#replaceFormToPoint();

  };

  #handleFavoriteClick = () => {
    this.#changeData({ ...this.#point, isFavorite: !this.#point.isFavorite });
  };

}
