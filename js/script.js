const form = document.forms['form-task'];
const listOfTasks = document.querySelector('.list-tasks');
const listOfTasksCompleteds = document.querySelector('.list-completed');
const progress = document.querySelector('.progress-bar');
const { inputTask } = form;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskText = inputTask.value.trim();

    if (taskText) {
        tasks.push(taskText);
        updateLocalStorage('tasks', tasks);
        inputTask.value = '';
        renderTasks();
    } else {
        alert('Campo Vazio');
    }
});

function updateLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function createTaskElement(taskText, isCompleted = false) {
    const li = document.createElement('li');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-text';

    const markDiv = document.createElement('div');
    markDiv.className = `mark${isCompleted ? ' completed' : ''}`;
    markDiv.addEventListener('click', () => toggleTaskCompletion(taskText, isCompleted, markDiv));

    const p = document.createElement('p');
    p.textContent = taskText;

    const btnDelete = document.createElement('button');
    btnDelete.className = 'btn-delete';
    btnDelete.innerHTML = '<img src="./images/Trash_Empty.svg" alt="Delete">';
    btnDelete.addEventListener('click', () => removeTask(taskText, isCompleted));

    taskDiv.append(markDiv, p);
    li.append(taskDiv, btnDelete);
    return li;
}

function toggleTaskCompletion(taskText, isCompleted, markDiv) {
    markDiv.classList.toggle('completed');
    const [sourceList, targetList] = isCompleted ? [completedTasks, tasks] : [tasks, completedTasks];

    moveTaskBetweenLists(taskText, sourceList, targetList);
    renderTasks();
}

function moveTaskBetweenLists(taskText, sourceList, targetList) {
    const taskIndex = sourceList.indexOf(taskText);
    if (taskIndex > -1) {
        sourceList.splice(taskIndex, 1);
        targetList.push(taskText);
        updateLocalStorage('tasks', tasks);
        updateLocalStorage('completedTasks', completedTasks);
    }
}

function removeTask(taskText, isCompleted) {
    const list = isCompleted ? completedTasks : tasks;
    const taskIndex = list.indexOf(taskText);
    if (taskIndex > -1) {
        list.splice(taskIndex, 1);
        updateLocalStorage(isCompleted ? 'completedTasks' : 'tasks', list);
        renderTasks();
    }
}

function renderTasks() {
    listOfTasks.innerHTML = '';
    listOfTasksCompleteds.innerHTML = '';

    tasks.forEach(task => listOfTasks.appendChild(createTaskElement(task)));
    completedTasks.forEach(task => listOfTasksCompleteds.appendChild(createTaskElement(task, true)));

    updateProgress();
}

function updateProgress() {
    const totalTasks = tasks.length + completedTasks.length;
    progress.value = totalTasks ? (completedTasks.length / totalTasks) * 100 : 0;
}

renderTasks();
