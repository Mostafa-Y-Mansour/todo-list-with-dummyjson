let li = document.querySelector(".list-todos-ul");
// show all todos
fetch("https://dummyjson.com/todos")
  .then((res) => res.json())
  .then((data) => {
    let mytodos = data.todos;
    let item = "";
    for (let i = 0; i < mytodos.length; i++) {
      item += `
              <li class="todo-li ${mytodos[i].completed ? "checked" : ""}" id="${mytodos[i].id}">
          <i class="fas fa-check-square checkbox"></i>
          <p class="content">${mytodos[i].todo}</p>
          <div class="edit-delete">
            <i title="edit" class="fas fa-pen edit"></i>
            <i title="delete" class="fas fa-trash delete"></i>
          </div>
        </li>
      `;
    }
    // console.log(mytodos[2].completed);
    return item;
  })
  .then((item) => {
    li.innerHTML += item;
  })
  .then(() => {
    editEvent();
    deleteTodo();
    checkboxEvent();
  })
  .catch((err) => {
    console.error("Error", err);
  });

// add a new todo
let addBtn = document.querySelector("#add-btn");
let addInput = document.querySelector("#add-input");

addBtn.addEventListener("click", () => {
  addTodo(addInput.value);
});

addInput.addEventListener("keypress", (e) => {
  if (e.keyCode === 13) addTodo(addInput.value);
});

function addTodo(value) {
  fetch("https://dummyjson.com/todos/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      todo: value,
      completed: false,
      userId: 5,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      let item = "";
      item += `
              <li class="todo-li ${data.completed ? "checked" : ""}" id="${data.id}">
          <i class="fas fa-check-square checkbox"></i>
          <p class="content">${data.todo}</p>
          <div class="edit-delete">
            <i title="edit" class="fas fa-pen edit"></i>
            <i title="delete" class="fas fa-trash delete"></i>
          </div>
        </li>
        `;
      console.log(data);
      return item;
    })
    .then((item) => {
      li.innerHTML += item;
    })
    .then(() => {
      editEvent();
      deleteTodo();
      checkboxEvent();
    })
    .catch((err) => {
      console.error("Error", err);
    });
}

// edit a todo
function editEvent() {
  let editTodos = document.querySelectorAll(".edit");
  editTodos.forEach((editTodo) => {
    editTodo.addEventListener("click", () => {
      let parentP = editTodo.parentElement.previousElementSibling;
      let input = document.createElement("input");
      input.className = "content";
      input.value = parentP.innerHTML;

      parentP.replaceWith(input);
      input.focus();

      input.addEventListener(`blur`, leaveInput);
      function leaveInput() {
        parentP.innerHTML = input.value;
        editTodo.parentElement.parentElement.className = "todo-li";
        updateTodo(editTodo.parentElement.parentElement.id);

        input.replaceWith(parentP);
      }
    });
  });
}
/* updating completed status of todo with id 1 */
function updateTodo(id) {
  fetch(`https://dummyjson.com/todos/${id}`, {
    method: "PUT" /* or PATCH */,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      completed: false,
    }),
  })
    .then((res) => res.json())
    .then(console.log);
}

// delete a todo

function deleteTodo() {
  let dels = document.querySelectorAll(".delete");

  dels.forEach((del) => {
    let delNum;
    del.addEventListener("click", () => {
      del.parentElement.parentElement.replaceWith("");
      delNum = del.parentElement.parentElement.id;
      fetch(`https://dummyjson.com/todos/${delNum}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    });
  });
}

// check todo

function checkboxEvent() {
  let checkboxs = document.querySelectorAll(".checkbox");

  checkboxs.forEach((checkbox) => {
    checkbox.addEventListener("click", () => {
      if (checkbox.parentElement.classList[1] === "checked") {
        checkbox.parentElement.classList.remove("checked");
        fetch(`https://dummyjson.com/todos/${checkbox.parentElement.id}`, {
          method: "PUT" /* or PATCH */,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: false,
          }),
        })
          .then((res) => res.json())
          .then(console.log);
      } else {
        checkbox.parentElement.classList.add("checked");
        fetch(`https://dummyjson.com/todos/${checkbox.parentElement.id}`, {
          method: "PUT" /* or PATCH */,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: true,
          }),
        })
          .then((res) => res.json())
          .then(console.log);
      }
    });
  });
}
