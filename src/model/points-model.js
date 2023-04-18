import { createPoint } from '../mock/points';

export default class PointsModel {

  #point = Array.from({ length: 10 }, createPoint);

  get point() {
    return this.#point;
  }
}
