import { render, RenderPosition } from './render.js';
import MainPresenter from './presenter/main-presenter';
import Filter from './view/filter';
import PointsModel from './model/points-model';


const filterContainer = document.querySelector('.trip-controls__filters');
const tripContainer = document.querySelector('.trip-events');
const pointModel = new PointsModel();

render(new Filter(), filterContainer, RenderPosition.BEFOREEND);

const mainPresenter = new MainPresenter({container: tripContainer});

mainPresenter.init(tripContainer, pointModel);
