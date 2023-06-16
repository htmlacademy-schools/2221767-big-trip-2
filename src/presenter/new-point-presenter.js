import PointEdit from '../view/point-edit';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../const/utils';
import { isEscKeyDown } from '../utils';
import { nanoid } from 'nanoid';

export default class NewPointPresenter {

  #pointsListContainer = null;
  #changeData = null;

  #destroyCallback = null;
  #pointEditComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #destinations = null;
  #offers = null;

  constructor(pointsListContainer, changeData, pointsModel, destinationsModel, offersModel) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#pointEditComponent = new PointEdit({
      destination: this.#destinations,
      offers: this.#offers,
    });

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseClick);

    render(this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }
    this.#destroyCallback();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (isEscKeyDown(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      { id: nanoid(), ...point },
    );
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleCloseClick = () => {
    this.destroy();
  };
}
