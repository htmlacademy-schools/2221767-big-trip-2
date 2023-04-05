import { generatePoint } from '../mock/points';

export default class Points {
  constructor() {
    this.points = Array.from({ length: 10 }).map((value, index) =>
      generatePoint(index + 1)
    );
  }

  getPoints() {
    return this.points;
  }
}
