(function () {
  //Создание и возврат заголовка приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };

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

  function createTodoItem({ name, done }) {
    let item = document.createElement('li');

    //Кнопки внутри элемента для выполнения/удаления дела
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //Стили для элемента списка и нормального отображения кнопок в нем
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (done === true) {
      item.classList.add('list-group-item-success');
    }

    //Вкладываю кнопки в общую группу
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //Возврат элемента списка и кнопок
    return {
      item,
      doneButton,
      deleteButton,
    };
  };

  function createTodoApp(container, title = 'Список дел', defaultsItems = [], key) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    let tasks = localStorage[key] ? JSON.parse(localStorage[key]) : defaultsItems;

    if (tasks.length) {
      for (let items of tasks) {
        const defaultItem = createTodoItem(items);
        todoList.append(defaultItem.item);

        //Обработчики для кнопок в списке дел по умолчанию
        defaultItem.doneButton.addEventListener('click', function () {
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].name === items.name) {
              tasks[i].done = true;
              defaultItem.item.classList.add('list-group-item-success');
            }
          }
          localStorage.setItem(key, JSON.stringify(tasks));
        });

        defaultItem.deleteButton.addEventListener('click', function () {
          if (confirm('Вы уверены?')) {
            defaultItem.item.remove();
            for (let i = 0; i < tasks.length; i++) {
              if (tasks[i].name === items.name) {
                tasks.splice(i, 1);
              }
            }
            localStorage.setItem(key, JSON.stringify(tasks));
          }
        });
      }
    }

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todoItemForm.form.addEventListener('submit', function (e) {
      e.preventDefault(); //Предотвращает перезагрузку страницы при отправке формы (это действие по умолчанию)

      //Игнорирование создания элемента, если в поле формы ничего не введено
      if (!todoItemForm.input.value) {
        return;
      };

      let todoItem = createTodoItem({ name: todoItemForm.input.value, done: false });

      //Обработчики для кнопок
      todoItem.doneButton.addEventListener('click', function () {
        for (let i = 0; i < tasks.length; i++) {
          if (tasks[i].name === todoItem.item.firstChild.textContent) {
            tasks[i].done = true;
            todoItem.item.classList.add('list-group-item-success');
          }
        }
        localStorage.setItem(key, JSON.stringify(tasks));
      });

      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].name === todoItem.item.firstChild.textContent) {
              tasks.splice(i, 1);
            }
          }
          localStorage.setItem(key, JSON.stringify(tasks));
        }
      });

      tasks.push({ name: todoItemForm.input.value, done: false });

      localStorage.setItem(key, JSON.stringify(tasks));

      //Создание и добавление нового дела в список с названием из поля ввода
      todoList.append(todoItem.item);

      //Обнуление значения в поле ввода, чтобы не стирать его вручную
      todoItemForm.input.value = '';
      todoItemForm.button.setAttribute('disabled', 'disabled');
    });
  };
  window.createTodoApp = createTodoApp;
})();


