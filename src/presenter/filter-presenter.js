import { FILTER_TYPE, UpdateType } from '../mock/consts';
import { remove, replace, render } from '../framework/render';
import { filterFunction } from '../utils/filter';
import Filter from '../view/filter';
export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FILTER_TYPE.EVERYTHING,
        name: 'EVERYTHING',
        count: filterFunction[FILTER_TYPE.EVERYTHING](points).length,
      },
      {
        type: FILTER_TYPE.PAST,
        name: 'PAST',
        count: filterFunction[FILTER_TYPE.PAST](points).length,
      },
      {
        type: FILTER_TYPE.FUTURE,
        name: 'FUTURE',
        count: filterFunction[FILTER_TYPE.FUTURE](points).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const filterComponent = this.#filterComponent;

    this.#filterComponent = new Filter(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (filterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, filterComponent);
    remove(filterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
