import { render } from './render.js';
import MainPresenter from './presenter/main-presenter';
import Filter from './view/filter';
import PointList from "./view/point-list";
import Menu from "./view/menu";

const filterContainer = document.querySelector('.trip-controls__filters');
const navigationContainer = document.querySelector('.trip-controls__navigation');
const tripContainer = new PointList();


render(new Filter(), filterContainer)
render(new Menu(), navigationContainer);

const mainPresenter = new MainPresenter(tripContainer)
mainPresenter.init();
