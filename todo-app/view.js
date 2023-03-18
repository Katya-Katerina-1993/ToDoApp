//Создание и возврат заголовка приложения
function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
};

// Переключение хранилища на кнопке
function switchStorage() {
  const selectBtn = document.getElementById('select-btn');

  selectBtn.addEventListener('click', () => {
    if (selectBtn.textContent === 'Перейти на серверное хранилище') {
      selectBtn.textContent = 'Перейти на локальное хранилище';
      console.log('Какая-то логика, происходящая при переключении хранилища на локальное');
    } else {
      selectBtn.textContent = 'Перейти на серверное хранилище';
      console.log('Какая-то логика, происходящая при переключении хранилища на серверное');
    }
  })
};
switchStorage();

//Создание и возврат формы для создания дела
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.setAttribute('disabled', 'disabled');
  button.textContent = 'Добавить дело';

  // Разблокировка кнопки при вводе текста
  input.addEventListener('input', function (e) {
    e.preventDefault();
    if (input.value) {
      button.removeAttribute('disabled');
    };
  });

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
};

//Создание и возврат списка элементов
function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
};

function createTodoItemElement(todoItem, { onDone, onDelete }) {
  const doneClass = 'list-group-item-success';
  let item = document.createElement('li');

  //Кнопки внутри элемента для выполнения/удаления дела
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  //Стили для элемента списка и нормального отображения кнопок в нем
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  if (todoItem.done) {
    item.classList.add(doneClass);
  }
  item.textContent = todoItem.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  //Обработчики для кнопок
  doneButton.addEventListener('click', function () {
    onDone({ todoItem, element: item });
    item.classList.toggle(doneClass, todoItem.done);
  });

  deleteButton.addEventListener('click', function () {
    onDelete({ todoItem, element: item });
  });

  //Вкладываю кнопки в общую группу
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  //Возврат элемента списка
  return item;
};

async function createTodoApp(container, {
  title,
  owner,
  todoItemList = [],
  onCreateFormSubmit,
  onDoneClick,
  onDeleteClick,
}) {
  let todoAppTitle = createAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  const heandlers = { onDone: onDoneClick, onDelete: onDeleteClick };


  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  todoItemList.forEach(todoItem => {
    const todoItemElement = createTodoItemElement(todoItem, heandlers);
    todoList.append(todoItemElement);
  });

  todoItemForm.form.addEventListener('submit', async function (e) {
    e.preventDefault(); //Предотвращает перезагрузку страницы при отправке формы (это действие по умолчанию)

    //Игнорирование создания элемента, если в поле формы ничего не введено
    if (!todoItemForm.input.value) {
      return;
    };

    const todoItem = await onCreateFormSubmit({
      owner,
      name: todoItemForm.input.value.trim(),
    });

    const todoItemElement = createTodoItemElement(todoItem, heandlers);

    tasks.push({ name: todoItemForm.input.value, done: false });

    localStorage.setItem(key, JSON.stringify(tasks));

    //Создание и добавление нового дела в список с названием из поля ввода
    todoList.append(todoItemElement);

    //Обнуление значения в поле ввода, чтобы не стирать его вручную
    todoItemForm.input.value = '';
    todoItemForm.button.setAttribute('disabled', 'disabled');
  });
};
export { createTodoApp };



