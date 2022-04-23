/* eslint-disable class-methods-use-this */
import Task from './Task';

export default class Logic {
  constructor(container) {
    this.container = container;
    this.input = container.querySelector('.tasks__input');
    this.inputField = this.container.querySelector('#inputField');
    this.tasksPinned = container.querySelector('.tasks__pinned');
    this.tasksAll = container.querySelector('.tasks__all');
    this.tasksList = []; // Общий список задач

    this.registerEvents();
  }

  registerEvents() {
    const addButton = this.input.querySelector('.tasks__input-button');
    this.inputField.addEventListener('input', this.inputTextHandler.bind(this));
    this.inputField.addEventListener('keydown', this.keyValidate.bind(this));
    addButton.addEventListener('click', this.addTask.bind(this));
    // this.tasksAll.addEventListener('click', this.allTasksHandler.bind(this));
    this.container.addEventListener('click', this.allTasksHandler.bind(this));
  }

  /**
   * Обработчик события ввода
   * @param {} event -
   */
  inputTextHandler(event) {
    //! Тут будет поиск
    // console.log(event.target.value);
  }

  /**
   * Проверка нажатой клавиши
   * @param {*} event -
   */
  keyValidate(event) {
    if (event.keyCode === 13) {
      console.log('Enter');
      this.addTask();
    }
  }

  /**
   * Обработка событий на всем списке
   * @param {*} event -
   */
  allTasksHandler(event) {
    //! Событие срабатывает два раза
    // Добавляем в Pinned
    if (event.target.type === 'checkbox') {
      this.movingPined(event);
    }
    // Удаляем элемент
    if (event.target.classList.contains('item__button-remove')) {
      this.removeTask(event);
    }
  }

  /**
   * Перемещает элемент между списками Pinned и All
   * @param {*} event -
   */
  movingPined(event) {
    // Поучаем сам элемент задачи
    const element = event.target.closest('.tasks__item');
    // id этого элемента
    const id = +element.dataset.id;
    // Находим его в массиве данных
    const checkedItem = this.tasksList.find((item) => item.id === id);
    // Изменяем состояние в массиве данных
    checkedItem.checked = event.target.checked;

    // Перемещаем элемент
    if (event.target.checked) {
      this.tasksPinned.append(element);
    } else {
      this.tasksAll.append(element);
    }

    console.log(this.tasksList);
  }

  /**
   * Удаляет элемент из списка задач
   * @param {*} event -
   */
  removeTask(event) {
    const element = event.target.closest('.tasks__item');
    this.tasksList = this.tasksList.filter((item) => item.id !== +element.dataset.id);
    element.remove();
  }

  /**
   * Добавляет элемент в список задач
   * @param {*} event -
   */
  addTask(event) {
    // console.log('add', this.inputField.value);
    if (this.inputField.value === '') {
      console.warn('Пустая строка');
      return;
    }
    const task = new Task(this.inputField.value);
    this.tasksList.push(task);
    this.tasksAll.append(this.renderTask(task));
    this.inputField.value = '';
    console.log(this.tasksList);
  }

  /**
   * Генерирует html элемент списка задач
   * @param {*} data - объект с параметрами задачи
   * @returns html элемент
   */
  renderTask(data) {
    const div = document.createElement('div');
    const wrapper = document.createElement('div');
    const p = document.createElement('p');
    const input = document.createElement('input');
    const label = document.createElement('label');
    const button = document.createElement('button');

    div.classList.add('tasks__item', 'item');
    div.dataset.id = data.id;
    wrapper.classList.add('item__buttons');

    p.classList.add('item__text');
    p.textContent = data.text;
    div.append(p);

    input.classList.add('item__checkbox');
    input.setAttribute('type', 'checkbox');
    // input.setAttribute('name', data.id);
    input.setAttribute('id', data.id);
    wrapper.append(input);

    label.setAttribute('for', data.id);
    wrapper.append(label);

    button.classList.add('item__button-remove', 'button');
    wrapper.append(button);

    div.append(wrapper);

    return div;
  }
}
