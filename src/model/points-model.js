import { createPoint } from '../mock/points';

export default class PointsModel {

  #point = Array.from({ length: 5 }, createPoint);

  get point() {
    return this.#point;
  }
}
