function addTask() {
    const taskInput = document.getElementById('taskInput')
    const taskText = taskInput.value.trim()

    if (taskText === '') {
        alert('Please enter a task.')
        return
    }

    const taskList = document.getElementById('taskList')
    const taskItem = document.createElement('li')
    taskItem.textContent = taskText

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'
    deleteButton.className = 'delete-button'
    deleteButton.onclick = function () {
        taskList.removeChild(taskItem)
    }

    taskItem.appendChild(deleteButton)
    taskList.appendChild(taskItem)

    taskInput.value = ''
}
addTask()
