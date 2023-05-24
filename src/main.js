//import { render } from './framework/render.js';
import MainPresenter from './presenter/main-presenter';
//import Filter from './view/filter';
import PointsModel from './model/points-model';


//const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const tripNavContainer = document.querySelector('.trip-controls__navigation');
const pointModel = new PointsModel();


const mainPresenter = new MainPresenter(tripContainer, tripNavContainer, pointModel);

mainPresenter.init();
