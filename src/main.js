import { render } from './framework/render.js';
import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import ButtonNewPoint from './view/button-new-point';
import FiltersModel from './model/filters-model';
import FilterPresenter from './presenter/filter-presenter';
import PointsApi from './points-api-service';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const AUTHORIZATION = 'Basic kazakhstan88005553535'; //
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip'; //

const siteMain = document.querySelector('.page-main');
const siteHeader = document.querySelector('.trip-main');


const buttonNewPoint = new ButtonNewPoint();
const filtersModel = new FiltersModel();

const pointsModel = new PointsModel(new PointsApi(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new PointsApi(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new PointsApi(END_POINT, AUTHORIZATION));


const filterPresenter = new FilterPresenter(siteHeader.querySelector('.trip-controls__filters'), filtersModel, pointsModel);
filterPresenter.init();

const mainPresenter = new MainPresenter(siteMain.querySelector('.trip-events'), pointsModel, filtersModel, destinationsModel, offersModel);
mainPresenter.init();


const handleNewPointFormClose = () => {
  buttonNewPoint.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  mainPresenter.createPoint(handleNewPointFormClose);
  buttonNewPoint.element.disabled = true;
};

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(buttonNewPoint, siteHeader);
      buttonNewPoint.setClickHandler(handleNewPointButtonClick);
    });
  });
});
