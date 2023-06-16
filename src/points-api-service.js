import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApi extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoints = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  };

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  updateDestinations = async (destination) => {
    const response = await this._load({
      url: `destinations/${destination.id}`,
      method: Method.PUT,
      body: JSON.stringify(destination),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  };

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  updateOffers = async (offer) => {
    const response = await this._load({
      url: `offers/${offer.type}`,
      method: Method.PUT,
      body: JSON.stringify(offer),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
