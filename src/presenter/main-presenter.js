import { render, RenderPosition } from '../framework/render';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import NoPoint from '../view/no-point';
import PointPresenter from "./point-presenter";
import { updateItem } from '../utils';

export default class MainPresenter {
  #tripPoints = [];
  #container = null;
  #tripNavContainer = null;
  #pointsModel = null;

  #pointsList = new TripList();
  #sort = new Sort();
  #noPoint = new NoPoint();
  #pointPresenter = new Map();
  constructor(container, tripNavContainer, pointsModel) {
    this.#container = container;
    this.#tripNavContainer = tripNavContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.point];

    if (this.#tripPoints.length === 0) {
      return this.#renderNoPoints();
    }
      this.#renderSort();
      this.#renderPointsList();
    }

  #renderSort = () => {
    render(this.#sort, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints = () => {
    render(this.#noPoint, this.#container, RenderPosition.AFTERBEGIN);
  }

  #renderPoints = (from, to) => {
    this.#tripPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderPointsList = () => {
    render(this.#pointsList, this.#container);
    this.#renderPoints(0, this.#tripPoints.length);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  //#clearEventsList = () => {
    //this.#pointPresenter.forEach((presenter) => presenter.destroy());
    //this.#pointPresenter.clear();
  //};

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };
}

