// TODO: write code here
import Logic from './Logic';

const tasks = document.querySelector('#tasks');
const app = new Logic(tasks);
app.load();
