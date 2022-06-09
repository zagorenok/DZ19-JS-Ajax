const wrapper = document.querySelector(".wrapper");
const input = document.querySelector("#input");
const list = document.querySelector("#list");

wrapper.addEventListener("click", (e) => {
  let action = e.target.dataset.action;
  let element = e.target;

  switch (action) {
    case "create":
      let data = JSON.stringify({
        task: input.value,
        complited: false,
      });

      createUpdateTodo("", "POST", data)
        .then(res => {
          let newLi = document.createElement("li");
          newLi.classList.add("in-progress");
          newLi.dataset.id = res.id;
          newLi.innerHTML = `<input type="checkbox" value="" data-action="update">${res.task}`;
          list.append(newLi);
          input.value = "";
        })
        .catch(error => console.warn(error));

      break;

    case "update":
      createUpdateTodo(
        +element.value,
        "PATCH",
        JSON.stringify({complited: element.checked})
      )
        .then(() => element.closest("li").classList.toggle("done"))
        .catch(error => console.warn(error));
      break;
  }
});

function renderTodos() {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "http://localhost:3000/todos/", true);
    xhr.responseType = "json";

    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
}

function createUpdateTodo(todoId, type, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let url = "http://localhost:3000/todos/";

    if (typeof todoId === "number") {
      url += todoId;
    }

    xhr.open(type, url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

    xhr.responseType = "json";
    xhr.onload = function () {
      let status = xhr.status;

      if (status === 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.onerror = function (e) {
      reject(url);
    };

    xhr.send(data);
  });
}

renderTodos()
  .then((todos) => {
    let lis = "";
    for (const todo of todos) {
      if (!todo) {
        return;
      }
      lis += `<li ${todo.complited ? 'class="done"' : ""}><input type="checkbox" value="${todo.id}" data-action="update" ${todo.complited ? "checked" : ""}><span class="task-name">${todo.task}</span></li>`}

    list.innerHTML = lis;
  })
  .catch(error => console.warn(error));
