import { render, RenderPosition, remove } from '../framework/render';
import Sort from '../view/sort';
import TripList from '../view/trip-list';
import NoPoint from '../view/no-point';
import PointPresenter from '../presenter/point-presenter';
import { SORT_TYPE } from '../const/sort';
import { sortFunction } from '../utils/sort';
import NewPointPresenter from './new-point-presenter';
import { FILTER_TYPE} from '../const/filter';
import { UpdateType, UserAction } from "../const/utils";
import { filterFunction } from '../utils/filter.js';
import LoadingMessage from '../view/loading-message';

export default class MainPresenter {
  #filterModel = null;
  #tripContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #currentSortType = SORT_TYPE.DAY;
  #filterType = FILTER_TYPE.EVERYTHING;

  #pointsList = new TripList();
  #sortComponent = null;
  #noPointComponent = null;
  #loadingMessageComponent = new LoadingMessage();
  #pointPresenter = new Map();
  #newPointPresenter = null;
  #isLoadingMessage = true;
  constructor(tripContainer, pointsModel, filterModel, destinationsModel, offersModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#newPointPresenter = new NewPointPresenter(this.#pointsList.element, this.#handleViewAction, this.#pointsModel,  this.#destinationsModel, this.#offersModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderTrip();
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const filteredPoints = filterFunction[this.#filterType](this.#pointsModel.points);
    sortFunction[this.#currentSortType](filteredPoints);

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPE.EVERYTHING);
    this.#newPointPresenter.init(callback);
  };

  #renderTrip = () => {
    if (this.#isLoadingMessage) {
      this.#renderLoadingMessage();
      return;
    }
    const pointCount = this.points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList(this.points);
  };

  #renderSort = () => {
    this.#sortComponent = new Sort(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPoint(this.#filterType);
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsList.element, this.#pointsModel, this.#handleViewAction, this.#handleModeChange, this.#destinationsModel, this.#offersModel);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointList = (points) => {
    render(this.#pointsList, this.#tripContainer);
    this.#renderPoints(points);
  };

  #renderLoadingMessage = () => {
    render(this.#loadingMessageComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #clearAll = ({ resetSortType = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearAll();
    this.#renderTrip();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearAll();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearAll({ resetSortType: true });
        this.#renderTrip();
        break;
      case UpdateType.INIT:
        this.#isLoadingMessage = false;
        remove(this.#loadingMessageComponent);
        remove(this.#noPointComponent);
        this.#renderTrip();
        break;
    }
  };
}

