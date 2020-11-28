const todos = document.querySelector(".todos_list");
const form = document.querySelector("form");
const ip = "http://localhost:8080/todos"

const get_todos = () => {
    return fetch(ip)
    .then(res => res.json());
}
const get_todo = (id) => {
    return fetch(`${ip}/${id}`)
    .then(res => res.json());
}
const post_todo = function(todo){
    return fetch(ip, {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
    .then(res => res.json());
}
const patch_todo = function(todo, id){
    return fetch(`${ip}/${id}`, {
        method: "PATCH",
        body: JSON.stringify(todo),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
    .then(res => res.json());
}
const delete_todo = function(todo, id){
    return fetch(`${ip}/${id}`, {
        method: "DELETE",
        body: JSON.stringify(todo),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        }
    })
    .then(()=> todo.remove())
    .catch(console.error);
}
const create_todo = function(td, id) {

    const { content, box_checked } = td;

    const todo = document.createElement("div");
    todo.setAttribute("todo-id", id);
    todo.classList.add("todos_todo");

    const todo_delete = document.createElement("div");
    todo_delete.classList.add("todo_delete");
    todo_delete.innerText = "×";

    const todo_checkbox = document.createElement("input");
    todo_checkbox.setAttribute("type", "checkbox");

    const todo_text = document.createElement("div");
    todo_text.classList.add("todo_text");
    todo_text.innerText = content;

    if(box_checked){
        todo_checkbox.checked = true;
        todo.classList.toggle("text_overline");
    }

    todo_checkbox.addEventListener("change", (e) => {
        get_todo(id)
        .then(res=> patch_todo({box_checked: !res.box_checked}, id))
        .then(()=> todo.classList.toggle("text_overline"))
        .catch(console.error);
    });
    todo_delete.addEventListener("click", (e) => {
        delete_todo(todo, id);
    });

    todo.appendChild(todo_delete);
    todo.appendChild(todo_checkbox);
    todo.appendChild(todo_text);

    return todo;
}
const render_todo = (todo) => todos.prepend(todo);

const build_todos = function(todos_list){
    const todos_wrapper = document.createDocumentFragment();

    todos_list.forEach(element => {
        todos_wrapper.prepend(element[0]);
    });

    render_todo(todos_wrapper);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { todotext } = e.target.elements;

    const todo_datas = {
        content: todotext.value,
        box_checked: false,
        time: Date.now()
    }

    post_todo(todo_datas)
    .then((res)=>{
        todotext.value = "";
        console.log(res);
        const todo = create_todo(todo_datas, res.id);
        render_todo(todo);
    })
    .catch(console.error);
});

window.addEventListener('load', (event) => {
    get_todos()
    .then(function(todos){
        const todos_list = [];

        for(let id in todos){
            const todo = create_todo(todos[id], id);

            todos_list.push([todo, todos[id].time]);
        }

        //sort the todos in function of their "time" propertie ( ascending order )
        todos_list.sort(function(a, b){
            return a[1] - b[1];
        });

        build_todos(todos_list);
    });
});





