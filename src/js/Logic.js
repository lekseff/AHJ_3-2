export default class Logic {
  constructor(container) {
    this.container = container;
    this.inputField = container.querySelector('#inputField');
    this.tasksPinned = container.querySelector('.tasks__pinned');
    this.tasksAll = container.querySelector('.tasks__all');
    this.tasksList = [];
  }
}
