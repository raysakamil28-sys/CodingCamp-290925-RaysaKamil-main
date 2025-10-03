// Simple To-Do app script
const form = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const dateInput = document.getElementById('date-input');
const todoListEl = document.getElementById('todo-list');
const filterInput = document.getElementById('filter-input');
const deleteAllBtn = document.getElementById('delete-all');

const STORAGE_KEY = 'simple_todos_v1';

let todos = [];

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
        todos = JSON.parse(raw) || [];
    } catch (e) {
        console.error('Failed to parse todos', e);
        todos = [];
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString();
}

function render(filter = '') {
    todoListEl.innerHTML = '';
    const list = todos.filter(t => t.text.toLowerCase().includes(filter.toLowerCase()));
    if (list.length === 0) {
        const tr = document.createElement('tr');
        tr.className = 'empty-row';
        const td = document.createElement('td');
        td.colSpan = 4;
        td.textContent = 'No task found';
        tr.appendChild(td);
        todoListEl.appendChild(tr);
        return;
    }

    list.forEach((todo) => {
        const tr = document.createElement('tr');

        const taskTd = document.createElement('td');
        taskTd.textContent = todo.text;
        if (todo.done) taskTd.classList.add('done');

        const dateTd = document.createElement('td');
        dateTd.textContent = formatDate(todo.dueDate);

        const statusTd = document.createElement('td');
        const statusBtn = document.createElement('button');
        statusBtn.textContent = todo.done ? 'Done' : 'Open';
        statusBtn.className = todo.done ? 'status done' : 'status';
        statusBtn.addEventListener('click', () => {
            todo.done = !todo.done;
            save();
            render(filterInput.value);
        });
        statusTd.appendChild(statusBtn);

        const actionsTd = document.createElement('td');
        const del = document.createElement('button');
        del.textContent = 'Delete';
        del.className = 'danger';
        del.addEventListener('click', () => {
            todos = todos.filter(t => t.id !== todo.id);
            save();
            render(filterInput.value);
        });
        actionsTd.appendChild(del);

        tr.appendChild(taskTd);
        tr.appendChild(dateTd);
        tr.appendChild(statusTd);
        tr.appendChild(actionsTd);

        todoListEl.appendChild(tr);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    const dueDate = dateInput.value || '';
    if (!text) return;
    const newTodo = {
        id: Date.now() + Math.random().toString(36).slice(2, 7),
        text,
        dueDate,
        done: false,
    };
    todos.push(newTodo);
    save();
    todoInput.value = '';
    dateInput.value = '';
    render(filterInput.value);
});

filterInput.addEventListener('input', () => {
    render(filterInput.value);
});

deleteAllBtn.addEventListener('click', () => {
    if (!confirm('Delete all tasks? This cannot be undone.')) return;
    todos = [];
    save();
    render();
});

// Initial load
load();
render();