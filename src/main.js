import { render } from './framework/render.js';
import MainPresenter from './presenter/main-presenter';
import Filter from './view/filter';
import PointsModel from './model/points-model';
import {generateFilter} from './mock/filter';
import { getPoints, getOffersByType, getDestinations } from './mock/points.js';

const siteMain = document.querySelector('.page-main');
const siteHeader = document.querySelector('.trip-main');

const points = getPoints();
const offersByType = getOffersByType();
const destinations = getDestinations();

const pointsModel = new PointsModel();
pointsModel.init(points, destinations, offersByType);

const mainPresenter = new MainPresenter(siteMain.querySelector('.trip-events'), pointsModel);
mainPresenter.init();


const filters = generateFilter(pointsModel.points);
render(new Filter(filters), siteHeader.querySelector('.trip-controls__filters'));

