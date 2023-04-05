import { render } from '../render';
import Sort from '../view/sort';
import PointEdit from '../view/point-edit';
import PointNew from '../view/point-new';
import PointRoute from '../view/point-route';


export default class MainPresenter {
  constructor(container) {
    this.container = container;
  }

  init(pointsData, destinationsData, offersData) {
    const points = [...pointsData.getPoints()];
    const offers = offersData;
    const destinations = destinationsData;
    const tripSection = document.querySelector('.trip-events');

    render(new Sort(), tripSection);
    render(this.container, tripSection);
    render(new PointNew(), this.container.getElement());
    render(new PointEdit(points[0], offers, destinations), this.container.getElement()
    );

    for (const point of points) {
      render(new PointRoute(point, offers, destinations), this.container.getElement());
    }
  }
}
