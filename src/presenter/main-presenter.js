import { render } from '../render';
import Sort from '../view/sort';
import PointEdit from '../view/point-edit';
import PointNew from '../view/point-new';
import PointRoute from '../view/point-route';


export default class MainPresenter {
  constructor(container) {
    this.container = container;
  }

  init() {
    const tripSection = document.querySelector('.trip-events');
    render(new Sort(), tripSection);
    render(this.container, tripSection);
    render(new PointNew(), this.container.getElement());
    render(new PointEdit(), this.container.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointRoute(),this.container.getElement());
    }
  }
}
