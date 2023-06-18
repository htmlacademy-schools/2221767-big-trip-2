import { render, replace, remove } from '../framework/render.js';
import PointEdit from '../view/point-edit';
import PointRoute from '../view/point-route';
import { isEscKeyDown } from '../utils/utils';
import { UpdateType, UserAction } from '../const/utils';

export const Mode = {
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

  #destinationsModel = null;
  #offersModel = null;

  #destinations = null;
  #offers = null;

  constructor(pointsList, changeData, changeMode, destinationsModel, offersModel) {
    this.#pointsList = pointsList;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (point) => {
    this.#point = point;
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    const pointRouteComponent = this.#pointRouteComponent;
    const pointEditComponent = this.#pointEditComponent;

    this.#pointRouteComponent = new PointRoute(point, this.#destinations, this.#offers);
    this.#pointEditComponent = new PointEdit({
      point,
      destination: this.#destinations,
      offers: this.#offers,
      isNewPoint: false
    });

    this.#pointRouteComponent.setEditClickHandler(this.#handleEditClick);
    this.#pointRouteComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);

    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (pointRouteComponent === null || pointEditComponent === null) {
      render(this.#pointRouteComponent, this.#pointsList);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointRouteComponent, pointRouteComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointRouteComponent, pointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(pointRouteComponent);
    remove(pointEditComponent);
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

  #onEscKeyDown = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleCloseClick = () => {
    this.resetView();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
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

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointRouteComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };
}
