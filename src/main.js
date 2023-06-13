import { render } from './framework/render.js';
import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import { getPoints, getOffersByType, getDestinations } from './mock/points.js';
import ButtonNewPoint from './view/button-new-point';
import FiltersModel from './model/filters-model';
import FilterPresenter from './presenter/filter-presenter';

const siteMain = document.querySelector('.page-main');
const siteHeader = document.querySelector('.trip-main');

const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();
const buttonNewPoint = new ButtonNewPoint();
const filtersModel = new FiltersModel();

const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offersByType);

const filterPresenter = new FilterPresenter(siteHeader.querySelector('.trip-controls__filters'), filtersModel, pointsModel);
filterPresenter.init();

const mainPresenter = new MainPresenter(siteMain.querySelector('.trip-events'), pointsModel, filtersModel);
mainPresenter.init();


const handleNewPointFormClose = () => {
  buttonNewPoint.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  mainPresenter.createPoint(handleNewPointFormClose);
  buttonNewPoint.element.disabled = true;
};

render(buttonNewPoint, siteHeader);
buttonNewPoint.setClickHandler(handleNewPointButtonClick);
