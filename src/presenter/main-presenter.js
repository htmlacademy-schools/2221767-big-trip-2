import { render, RenderPosition } from '../framework/render';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import NoPoint from '../view/no-point';
import PointPresenter from '../presenter/point-presenter';
import { updateItem } from '../utils';
import { SORT_TYPE } from '../mock/sort';
import { sorting } from '../utils/sort';

export default class MainPresenter {
  #tripPoints = [];
  #tripContainer = null;
  #pointsModel = null;

  #currentSortType = SORT_TYPE.DAY;
  #sourcedBoardPoints = [];

  #pointsList = new TripList();
  #sort = new Sort();
  #noPoint = new NoPoint();
  #pointPresenter = new Map();
  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#tripPoints = [...this.#pointsModel.points];
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    if (this.#tripPoints.length === 0) {
      this.#renderNoPoints();
    }
    else {
      this.#renderSort();
      this.#renderPointsList();
    }

  }

  #renderSort = () => {
    sorting[SORT_TYPE.DAY](this.#tripPoints);
    render(this.#sort, this.#tripContainer, RenderPosition.AFTERBEGIN);
    this.#sort.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderNoPoints = () => {
    render(this.#noPoint, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (from, to) => {
    this.#tripPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  };

  #renderPointsList = () => {
    render(this.#pointsList, this.#tripContainer);
    this.#renderPoints(0, this.#tripPoints.length);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#pointsModel, this.#handlePointChange, this.#handleModeChange, );
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
    sorting[sortType](this.#tripPoints);

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

