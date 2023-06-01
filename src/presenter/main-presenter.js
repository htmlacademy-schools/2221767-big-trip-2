import { render, RenderPosition } from '../framework/render';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import NoPoint from '../view/no-point';
import PointPresenter from '../presenter/point-presenter';
import { updateItem } from '../utils';
import { SORT_TYPE } from '../mock/points';
import { sortByDay, sortByTime, sortByPrice} from '../utils';

export default class MainPresenter {
  #tripPoints = [];
  #container = null;
  #tripNavContainer = null;
  #pointsModel = null;

  #currentSortType = [];
  #sourcedBoardPoints = [];

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
    this.#sourcedBoardPoints = [...this.#pointsModel.point];

    if (this.#tripPoints.length === 0) {
      return this.#renderNoPoints();
    }
    this.#renderSort();
    this.#renderPointsList();
  }

  #renderSort = () => {
    render(this.#sort, this.#container, RenderPosition.AFTERBEGIN);
    this.#sort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoints = () => {
    render(this.#noPoint, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (from, to) => {
    this.#tripPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderPointsList = () => {
    render(this.#pointsList, this.#container);
    this.#renderPoints(0, this.#tripPoints.length);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearEventsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this.#tripPoints.sort(sortByDay);
        break;
      case SORT_TYPE.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SORT_TYPE.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearEventsList();
    this.#renderPointsList();
  };
}

