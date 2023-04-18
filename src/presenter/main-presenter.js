import { render } from '../render';
import Sort from '../view/sort';
import PointEdit from '../view/point-edit';
import PointRoute from '../view/point-route';
import TripList from '../view/trip-list';

export default class MainPresenter {
  #tripList = null;
  #container = null;
  #pointsModel = null;

  #pointsList = []
  constructor() {
    this.#tripList = new TripList();
  }

  init(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
    this.#pointsList = [...this.#pointsModel.point];

    render(new Sort(), this.#container);
    render(this.#tripList, this.#container);

    for (let i = 0; i < this.#pointsList.length; i++) {
      this.#renderPoint(this.#pointsList[i]);
    }
  }

  #renderPoint = (point) => {
    const pointRouteComponent = new PointRoute(point);
    const pointEditComponent = new PointEdit(point);

    const replaceEditToPoint = () => {
      this.#tripList.element.replaceChild(pointRouteComponent.element, pointEditComponent.element);
    };

    const replacePointToEdit = () => {
      this.#tripList.element.replaceChild(pointEditComponent.element, pointRouteComponent.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointRouteComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    render(pointRouteComponent, this.#tripList.element);
  }
}
