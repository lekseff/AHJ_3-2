export default class Task {
  constructor(text) {
    this.text = text;
    this.checked = false;
    this.id = null;

    this.idGenerator();
  }

  idGenerator() {
    this.id = Math.floor(Math.random() * 1e8);
  }
}
