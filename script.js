const taskInput = document.getElementById("new-task");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const toggleThemeBtn = document.getElementById("toggle-theme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isDark = localStorage.getItem("theme") === "dark";

/* Inicializa tema */
if (isDark) {
  document.body.classList.add("dark");
  toggleThemeBtn.textContent = "☀️";
}

/* Renderizar tarefas */
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span contenteditable="false" class="${task.completed ? "completed" : ""}">${task.text}</span>
      <div>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="moveTask(${index}, -1)">⬆️</button>
        <button onclick="moveTask(${index}, 1)">⬇️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

/* Adicionar */
function addTask() {
  const text = taskInput.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    taskInput.value = "";
    saveTasks();
  }
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

/* Editar */
function editTask(index) {
  const li = taskList.children[index];
  const span = li.querySelector("span");
  const editable = span.getAttribute("contenteditable") === "true";

  if (!editable) {
    span.setAttribute("contenteditable", "true");
    span.focus();
  } else {
    span.setAttribute("contenteditable", "false");
    tasks[index].text = span.innerText;
    saveTasks();
  }
}

/* Completar */
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

/* Deletar */
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

/* Reordenar */
function moveTask(index, direction) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= tasks.length) return;
  const [moved] = tasks.splice(index, 1);
  tasks.splice(newIndex, 0, moved);
  saveTasks();
}

/* Salvar no localStorage */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

/* Tema */
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggleThemeBtn.textContent = isDark ? "☀️" : "🌙";
});

/* Primeira renderização */
renderTasks();
