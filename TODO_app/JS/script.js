// 1 получим input
const addTask = document.querySelector('.add-input');
// 2 получим кнопки
const addButton = document.querySelector('.add-button');
const binButton = document.querySelector('.bin-button');

// 3 получим add-wrapper
const addWrapper = document.querySelector('.add-wrapper');

// 4 получим tasks-wrapper
const tasksWrapper = document.querySelector('.tasks-wrapper');

// 10 получим список дел
let todo = document.querySelector('.todo-list');
// 7 создадим пустой массив, в который будем записывать кждое новое дело (newTodo)
let todoList = [];

// 19 при перезагрузке массив очищается
//

if (localStorage.getItem('todo') != undefined) {
  todoList = JSON.parse(localStorage.getItem('todo'));
  displayTasks();
}
// 18 Чтобы наши данные сохранялись при обновлении страницы
//  Объекты веб-хранилища localStorage позволяют хранить пары ключ/значение в браузере.
// обращаемся к localStorage у него есть свойство  setItem(key, value) – в хранилище будет добавлено соответствующее ключу значение (новое значение, которое б-т сохранять localStorage, с именем 'todo'). 
// синтаксис storage.setItem(название Ключа, значение Ключа);
// localStorage принимает только строку, поэтому массив преобразуем в JSON-строку
// JSON.stringify преобразует значение JavaScript в строку JSON
// синтаксис JSON.stringify(value[, replacer[, space]])
// value - Значение, преобразуемое в строку JSON формате.
function updateLocalStorage() {
  localStorage.setItem('todo', JSON.stringify(todoList))
};

//! 3 пишем обработчик события при нажатии на кнопку
// обращаемся к кнопке и вешаем метод, который б-т отстеживать клик по кнопке
addButton.addEventListener('click', function() {
  if (!document.querySelector('.add-input').value) { // проверка, если пустой ввод
    return;
  }
  // 4 проверка
  // value возвращает или устанавливает значение текущего узла.
  // console.log(addTask.value);
  // 5 каждое новое дело будем записывать в объект, который бкдем добавлять в массив
  let newTodo = {
    todo: addTask.value,
    done: false, // свойство выполнена задача или нет
    important: false,
  };
  // 6 console.log(newTodo); //{todo: "123", cheked: false, important: false}
  // 8 обращается к созданному массиву и  внего с пом.метода push добавляем новое дело
  todoList.push(newTodo);
  // 9 console.log(todoList); //{todo: "123", cheked: false, important: false}
  // 14 вызываем функции displayTasks каждый раз, когда нажимаем кнопку
  displayTasks();

  document.querySelector('.add-input').value = ''; // после выполнения обновляется инпут
  // localStorage.setItem('todo', JSON.stringify(todoList));
});

//! 11 Функция, которая будет выводить список дел на страницу
function displayTasks() {
  // 12 перебираем массив todoList и каждый объект выводим на страницу в виде тега li
  //Метод forEach() выполняет указанную функцию один раз для каждого элемента в массиве.
  let displayTask = '';
  todoList.forEach(function(item,index) {
    // 17 чтобф каждый раз не перетирались li сделаем при пом конкатенации
    // 13 для проверки выведем в консоль item
    // console.log(item);
    // 15 зададим переменную
    // и при помощи шаблонных строк присваиваем  ей значения
    // let displayTask = ` // старая запись
    displayTask += `
    <li class="todo-item ${item.done ? 'todo-task--done':''} ${item.important ? 'todo-task--important':''}" id="${index}">
      <p class="todo-task">${item.todo}</p>  
      <div class="important-button important-button--not-active">
        <span></span>
      </div>
      <div class="bin-button"></div>
    </li>
    `;
    // 16 меняем содержимое HTML страницы
    todo.innerHTML = displayTask;
    updateLocalStorage();
    addAllListeners();
  })
};

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

// функция для отметки задачи выполненной
function makeTaskDone(item) {
  item.addEventListener('click', function(event) {
    // Свойство target интерфейса Event является ссылкой на объект, который был инициатором события. 
    let eventTarget = event.target;
    // Свойство Node.parentElement только для чтения, возвращает родителя узла DOM Element
    let eventTargetParent = eventTarget.parentElement;
    // условие, что при клике на кнопку important-button функция не срабатывала
    // getAttribute() возвращает значение указанного атрибута элемента.
    if (eventTarget.getAttribute('class').includes('important-button')) {
      return;
    }
    if (eventTarget.getAttribute('class').includes('bin-button')) {
      // здесь можно функцию...
      return;
    }
    if (eventTarget.getAttribute('class').includes('todo-item')) {
      // toggle ( String [, Boolean]) Если класс у элемента отсутствует - добавляет, иначе - убирает. 
      eventTarget.classList.toggle('todo-task--done');
      let itemId = eventTarget.getAttribute('id');
      todoList[itemId].done = !todoList[itemId].done;
      // проверка, если клик по тексту (дочерний элемент li), то родителю класс все равно присваиваем
    } else if (eventTargetParent.getAttribute('class').includes('todo-item')) {
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
};
// функция для удаления задачи
function deleteTask(item) {
  item.querySelector('.bin-button').addEventListener('click',function(event) {
    let parentElement = event.target.parentElement;
    todoList.splice(parentElement.getAttribute('id'), 1);
    parentElement.remove();
    updateLocalStorage();
  }); 
};


document.querySelector('.tab-list').addEventListener('click',function(event) {
  let element = event.target;
  let parentElement = element.parentElement;
  let liCollection = element.closest('.tab-list').children;
 // перебираем элементы списка
  for (let i=0; i<liCollection.length; i++) {
    liCollection[i].classList.remove('line--active');
    liCollection[i].children[0].classList.remove('tab--active');
  }

  if (element.getAttribute('id')) {
    element.classList.add('line--active');
    element.children[0].classList.add('tab--active');
  } else if (parentElement.getAttribute('id')) {
    parentElement.classList.add('line--active');
    parentElement.children[0].classList.add('tab--active');
  }
});

// по нажатию на закладку All отображаем все задачи
document.getElementById('all').addEventListener('click', function() {
  addWrapper.style.display = 'block';
  tasksWrapper.classList.add('tasks-wrapper--all');
  tasksWrapper.classList.remove('tasks-wrapper--done');
  tasksWrapper.classList.remove('tasks-wrapper--active');
});

// 
document.getElementById('active').addEventListener('click', function() {
  addWrapper.style.display = 'block';
  tasksWrapper.classList.add('tasks-wrapper--active');
  tasksWrapper.classList.remove('tasks-wrapper--all');
  tasksWrapper.classList.remove('tasks-wrapper--done');
});

//
document.getElementById('done').addEventListener('click', function() {
  addWrapper.style.display = 'none';
  tasksWrapper.classList.add('tasks-wrapper--done');
  tasksWrapper.classList.remove('tasks-wrapper--active');
  tasksWrapper.classList.remove('tasks-wrapper--all');
});
