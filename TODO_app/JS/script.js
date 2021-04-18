const addTask = document.querySelector('.add-input');
const addButton = document.querySelector('.add-button');
const addWrapper = document.querySelector('.add-wrapper');
let todo = document.querySelector('.todo-list'); //список дел (ul)

// создадим пустой массив, в который будем записывать кждое новое дело (newTodo)
let todoList = [];

//  при перезагрузке массив очищается
if (localStorage.getItem('todo') != undefined) {
  todoList = JSON.parse(localStorage.getItem('todo'));
  displayTasks();
}
//  Чтобы наши данные сохранялись при обновлении страницы
//  Объекты веб-хранилища localStorage позволяют хранить пары ключ/значение в браузере.
// обращаемся к localStorage у него есть свойство  setItem(key, value) – в хранилище будет добавлено соответствующее ключу значение (новое значение, которое б-т сохранять localStorage, с именем 'todo'). 
// синтаксис storage.setItem(название Ключа, значение Ключа);
// localStorage принимает только строку, поэтому массив преобразуем в JSON-строку
// JSON.stringify преобразует значение JavaScript в строку JSON
// синтаксис JSON.stringify(value[, replacer[, space]])
// value - Значение, преобразуемое в строку JSON формате.
function updateLocalStorage() {
  localStorage.setItem('todo', JSON.stringify(todoList))
}

//!  функция добавления новой задачи (будет вызвана при клике на кнопку ADD, или при нажатии Enter)
function addNewTask() {
	if (!addTask.value) return; // проверка, если пустой ввод
		
	// каждое новое дело будем записывать в объект, который бкдем добавлять в массив
	let newTodo = {
		todo: addTask.value,
		done: false, // свойство выполнена задача или нет
		important: false,
	};
	// обращается к созданному массиву и  внего с пом.метода push добавляем новое дело
	todoList.push(newTodo);
	//  вызываем функции displayTasks каждый раз, когда нажимаем кнопку
	displayTasks();
	
	addTask.value = ''; // после выполнения обновляется инпут
	updateLocalStorage();
	addAllListeners();
}
//!  пишем обработчик события при нажатии на кнопку ADD
// обращаемся к кнопке и вешаем метод, который б-т отстеживать клик по кнопке
addButton.addEventListener('click', function () {
	addNewTask()
});
//!  пишем обработчик события при нажатии на кнопку Enter
addTask.addEventListener('keydown', function (event) {
	if (event.code === 'Enter') addNewTask();
});

//! 11 Функция, которая будет выводить список дел на страницу
function displayTasks() {
  //  перебираем массив todoList и каждый объект выводим на страницу в виде тега li
  //Метод forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
  let displayTask = '';
	todoList.forEach(function (item, index) {
		displayTask += `
    <li tabindex="0" class="todo-item ${item.done ? 'todo-task--done' : ''} ${item.important ? 'todo-task--important' : ''}" id="${index}">
      <p class="todo-task">${item.todo}</p>  
      <div class="important-button important-button--not-active" tabindex="0"></div>
      <div class="bin-button" tabindex="0"></div>
    </li>
    `;
		//  меняем содержимое HTML страницы
		todo.innerHTML = displayTask;
		updateLocalStorage();
	});
}

function addAllListeners() {
  // найдем все пункты списка дел (все li)
  let todoItems = document.querySelectorAll('.todo-item');

  todoItems.forEach(item => {
    // при клике на поле задачи делаем ее выполненной
    makeTaskDone(item);

    // при клике на кнопку important-button
    makeImportantTask(item);

    // при клике на корзину
    deleteTask(item);

    updateLocalStorage();
  });
}
addAllListeners();

// функция для отметки задачи выполненной
function makeTaskDone(item) {
  item.addEventListener('click', function(event) {
    // Свойство target интерфейса Event является ссылкой на объект, который был инициатором события. 
    let eventTarget = event.target;
    // Свойство Node.parentElement только для чтения, возвращает родителя узла DOM Element
		let eventTargetParent = eventTarget.parentElement;
		
    // условие, что при клике на кнопки important-button и корзина функция не срабатывала (не зачеркивала)
    if (eventTarget.classList.contains('important-button')) return;
    
    if (eventTarget.classList.contains('bin-button')) return;
    
    if (eventTarget.classList.contains ('todo-item')) {
      // toggle ( String [, Boolean]) Если класс у элемента отсутствует - добавляет, иначе - убирает. 
      eventTarget.classList.toggle('todo-task--done');
      let itemId = eventTarget.getAttribute('id');
      todoList[itemId].done = !todoList[itemId].done;
      // проверка, если клик по тексту (дочерний элемент li), то родителю класс все равно присваиваем
    } else if (eventTargetParent.classList.contains ('todo-item')) {
      eventTargetParent.classList.toggle('todo-task--done');
      let itemId = eventTargetParent.getAttribute('id');
      todoList[itemId].done = !todoList[itemId].done;
    }
    updateLocalStorage();
  });
}
// функция преобразования задачи в важную или нет
function makeImportantTask(item) {
  item.querySelector('.important-button').addEventListener('click', function(event) {
    let parentElement = event.target.parentElement;
    parentElement.classList.toggle('todo-task--important');
    todoList[parentElement.getAttribute('id')].important = !todoList[parentElement.getAttribute('id')].important;
    updateLocalStorage();
  });
}
// функция для удаления задачи 
//! пофиксить
function deleteTask(item) {
  item.querySelector('.bin-button').addEventListener('click', function(event) {
    let parentElement = event.target.parentElement;
    todoList.splice(parentElement.getAttribute('id'), 1);
    parentElement.remove();
    updateLocalStorage();
  }); 
}

// переключение табов стилизация
document.querySelector('.tab-list').addEventListener('click',function(event) {
  let element = event.target; 
	let parentElement = element.parentElement;
	//Метод Element.closest() возвращает ближайший родительский элемент (или сам элемент),
  let liCollection = element.closest('.tab-list').children;
 // перебираем элементы списка (li) и удаляем классы
  for (let i = 0; i < liCollection.length; i++) {
    liCollection[i].classList.remove('line--active');
    liCollection[i].children[0].classList.remove('tab--active');
  }
	// если объект, который был инициатором события имеет id (т.е. является li), то
	// самой li добавляем класс line--active , а ее дочернему элементу (кнопке) - класс tab--active
	// иначе - если наоборот объект-инициатор кнопка (ее родитель емеет id)
  if (element.getAttribute('id')) {
    element.classList.add('line--active');
    element.children[0].classList.add('tab--active');
  } else if (parentElement.getAttribute('id')) {
    parentElement.classList.add('line--active');
    element.classList.add('tab--active');
  }
});

// по нажатию на закладку All отображаем все задачи
document.getElementById('all').addEventListener('click', function() {
  addWrapper.style.display = 'block'; // секция ввод задачи отображается
  todo.classList.add('todo-list--all');
  todo.classList.remove('todo-list--done');
  todo.classList.remove('todo-list--active');
});

// 
document.getElementById('active').addEventListener('click', function() {
  addWrapper.style.display = 'block'; // секция ввод задачи отображается
  todo.classList.add('todo-list--active');
  todo.classList.remove('todo-list--all');
  todo.classList.remove('todo-list--done');
});

//
document.getElementById('done').addEventListener('click', function() {
  addWrapper.style.display = 'none'; // секция ввода задачи не отображается
  todo.classList.add('todo-list--done');
  todo.classList.remove('todo-list--active');
  todo.classList.remove('todo-list--all');
});
