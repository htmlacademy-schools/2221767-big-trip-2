import './ui-blocker.css';

/**
 * Класс для блокировки интерфейса
 */
export default class UiBlocker {
  /** @type {number} Время до блокировки интерфейса в миллисекундах */
  #lowerLimit;

  /** @type {number} Минимальное время блокировки интерфейса в миллисекундах */
  #upperLimit;

  /** @type {HTMLElement|null} Элемент, блокирующий интерфейс */
  #element;

  /** @type {number} Время вызова метода block */
  #startTime;

  /** @type {number} Время вызова метода unblock */
  #endTime;

  /** @type {number} Идентификатор таймера */
  #timerId;
  lowerLimit;
  upperLimit;
  UPPER_LIMIT;
  LOWER_LIMIT;
  constructor(LOWER_LIMIT, UPPER_LIMIT) {
    this.LOWER_LIMIT = LOWER_LIMIT;
    this.UPPER_LIMIT = UPPER_LIMIT;
    this.#lowerLimit = this.lowerLimit;
    this.#upperLimit = this.upperLimit;

    this.#element = document.createElement('div');
    this.#element.classList.add('ui-blocker');
    document.body.append(this.#element);
  }

  /** Метод для блокировки интерфейса */
  block() {
    this.#startTime = Date.now();
    this.#timerId = setTimeout(() => {
      this.#addClass();
    }, this.#lowerLimit);
  }

  /** Метод для разблокировки интерфейса */
  unblock() {
    this.#endTime = Date.now();
    const duration = this.#endTime - this.#startTime;

    if (duration < this.#lowerLimit) {
      clearTimeout(this.#timerId);
      return;
    }

    if (duration >= this.#upperLimit) {
      this.#removeClass();
      return;
    }

    setTimeout(this.#removeClass, this.#upperLimit - duration);
  }

  /** Метод, добавляющий CSS-класс элементу */
  #addClass = () => {
    this.#element.classList.add('ui-blocker--on');
  };

  /** Метод, убирающий CSS-класс с элемента */
  #removeClass = () => {
    this.#element.classList.remove('ui-blocker--on');
  };
}
