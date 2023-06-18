import { render } from './framework/render.js';
import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import ButtonNewPoint from './view/button-new-point';
import FiltersModel from './model/filters-model';
import FilterPresenter from './presenter/filter-presenter';
import PointsApi from './points-api-service';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const AUTHORIZATION = 'Basic kazakhstan88005553535';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteHeader = document.querySelector('.trip-main');

const filterContainer = document.querySelector('.trip-controls__filters');
const tripInfoContainer = document.querySelector('.trip-main__trip-info');
const tripEventsContainer = document.querySelector('.trip-events');

const ButtonNewPointComponent = new ButtonNewPoint();
const pointsModel = new PointsModel(new PointsApi(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new PointsApi(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new PointsApi(END_POINT, AUTHORIZATION));

const filterModel = new FiltersModel();
const filterPresenter = new FilterPresenter(filterContainer, filterModel, pointsModel);
filterPresenter.init();

const mainPresenter = new MainPresenter(tripInfoContainer, tripEventsContainer, pointsModel, filterModel, destinationsModel, offersModel);

const handleNewPointFormClose = () => {
  ButtonNewPointComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  mainPresenter.createPoint(handleNewPointFormClose);
  ButtonNewPointComponent.element.disabled = true;
};

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      render(ButtonNewPointComponent, siteHeader);
      ButtonNewPointComponent.setClickHandler(handleNewPointButtonClick);
    });
  });
});

