/* eslint-disable class-methods-use-this */
import Task from './Task';

export default class Logic {
  constructor(container) {
    this.container = container;
    this.input = this.container.querySelector('.tasks__input'); // Блок ввода задачи
    this.inputField = this.container.querySelector('#inputField'); // Поле ввода
    this.tasksPinned = this.container.querySelector('.tasks__pinned'); // Блок с закрепленными задачами
    this.tasksAll = this.container.querySelector('.tasks__all'); // Блок со всем задачами
    this.tasksList = []; // Общий список задач

    this.registerEvents();
  }

  registerEvents() {
    const addButton = this.input.querySelector('.tasks__input-button');
    this.inputField.addEventListener('input', this.inputTextHandler.bind(this));
    this.inputField.addEventListener('keydown', this.keyValidate.bind(this));
    addButton.addEventListener('click', this.addTask.bind(this));
    this.container.addEventListener('click', this.allTasksHandler.bind(this));
  }

  /**
   * Старт приложения
   */
  load() {
    this.CheckingTaskList();
  }

  /**
   * Обработчик события ввода
   * @param {} event -
   */
  inputTextHandler(event) {
    // Проверяем была ли ошибка. Убираем, если была
    if (this.input.classList.contains('input-error')) {
      this.input.classList.remove('input-error');
      this.input.querySelector('.tasks__input-error').classList.remove('active-error');
    }

    // Поиск
    this.filterAllTasks(event.target.value.trim());
  }

  /**
   * Проверка нажатой клавиши
   * @param {*} event -
   */
  keyValidate(event) {
    if (event.keyCode === 13) {
      this.addTask();
    }
  }

  /**
   * Обработка событий на всем списке
   * @param {*} event -
   */
  allTasksHandler(event) {
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
    // Проверяем наличие элементов в списке
    this.CheckingTaskList();
  }

  /**
   * Удаляет элемент из списка задач
   * @param {*} event -
   */
  removeTask(event) {
    const element = event.target.closest('.tasks__item');
    const id = +element.dataset.id;
    this.tasksList = this.tasksList.filter((item) => item.id !== id);
    element.remove();
    this.CheckingTaskList();
  }

  /**
   * Добавляет элемент в список задач
   * @param {*} event -
   */
  addTask() {
    // Проверка на пустую строку
    const inputValue = this.inputField.value.trim();
    if (inputValue === '') {
      this.input.querySelector('.tasks__input-error').classList.add('active-error');
      this.input.classList.add('input-error');
      this.inputField.value = '';
      return;
    }
    const task = new Task(inputValue);
    this.tasksList.push(task);
    this.inputField.value = '';
    this.filterAllTasks();
  }

  /**
   * Фильтрует элементы AllTask по заданному значению
   * @param {*} data -
   */
  filterAllTasks(data = '') {
    const found = this.tasksList
      .filter((item) => !item.checked)
      .filter((item) => item.text.startsWith(data));

    // Очищаем список
    Array.from(this.tasksAll.children).forEach((item) => {
      if (item.classList.contains('tasks__item')) {
        item.remove();
      }
    });
    // Если есть данные ищем. Нет выводим весь список All
    if (data !== '') {
      found.forEach((item) => {
        this.tasksAll.append(this.renderTask(item));
      });
    } else {
      this.tasksList.forEach((item) => {
        if (item.checked) return;
        this.tasksAll.append(this.renderTask(item));
      });
    }
    this.CheckingTaskList(found.length);
  }

  /**
   * Проверка на пустой список + добавляет сообщение
   */
  CheckingTaskList(searchResult) {
    const pinned = this.tasksList.find((item) => item.checked === true);
    const allTasks = this.tasksList.find((item) => item.checked === false);

    if (!allTasks || searchResult === 0) {
      const element = this.tasksAll.querySelector('.tasks__error');
      element.textContent = allTasks ? 'No fount task' : 'No All tasks';
      element.classList.add('active-error');
    } else {
      this.tasksAll.querySelector('.tasks__error').classList.remove('active-error');
    }

    if (!pinned) {
      this.tasksPinned.querySelector('.tasks__error').classList.add('active-error');
    } else {
      this.tasksPinned.querySelector('.tasks__error').classList.remove('active-error');
    }
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
