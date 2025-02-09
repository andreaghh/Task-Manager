import fs from 'fs' // File system module to read and write files
import path from 'path' // Path module to handle file paths

// File paths for tasks and task configuration
const tasksFilePath = path.join('./data', 'tasks.json')
const configFilePath = path.join('./data', 'task-config.json')

// Load task priorities and statuses
function loadConfig() {
    try {
        const data = fs.readFileSync(configFilePath, 'utf8') // Read configuration file
        return JSON.parse(data) // Parse JSON data
    } catch (error) {
        console.error('Error loading task config:', error)
        return { priorities: [], statuses: [] } // Return empty arrays if file read fails
    }
}

// Load tasks from file
export function loadTasks() {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error loading tasks:', error)
        return []
    }
}

// Save tasks to file
export function saveTasks(tasks) {
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)) // Write tasks data to file
    } catch (error) {
        console.error('Error saving tasks:', error)
    }
}

// Get list of priorities from the file
export function getPriorities() {
    return loadConfig().priorities // Return list
}

// Get the statuses
export function getStatuses() {
    return loadConfig().statuses // Return list
}

// ADD TASK
export function addTask(task, taskLogic) {
    const { title, description, due_date, priority, status, completion_date, user } = task
    const today = new Date().toISOString().split('T')[0] // Get today's date

    // Ensure tasks marked as Completed or past due require a completion date
    if ((status === 'Completed' || due_date < today) && !completion_date) {
        return { error: "A task marked as Completed or past due must have a completion date." }
    }

    // Ensure Pending or Cancelled tasks do not have a completion date
    if ((status === 'Pending' || status === 'Cancelled') && completion_date) {
        return { error: "Only completed tasks can have a completion date." }
    }

    return { successMsg: taskLogic({ title, description, due_date, priority, status, completion_date, user }) }
}

//REGISTER TASK
export function registerToFile(task) {
    const tasks = loadTasks() // Load existing tasks
    const newId = tasks.length > 0 ? String(Number(tasks[tasks.length - 1].id) + 1) : "1" // Generate new task ID
    tasks.push({ id: newId, ...task }) // Add new task to the list
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2)) // Save updated tasks list
        return "Task registered successfully!"
    } catch (error) {
        console.error("Error saving tasks:", error)
        return "Error registering task."
    }
}

// UPDATE A TASK
export function updateTask(updatedTask) {
    let tasks = loadTasks() // Load existing tasks
    let index = tasks.findIndex(task => task.id == updatedTask.id) // Find task index by ID

    if (index === -1) {
        return { error: "Task not found" }
    }
    tasks[index] = { ...tasks[index], ...updatedTask } // Update task fields
    saveTasks(tasks) // Save updated task list

    return { successMsg: "Task updated successfully!" }
}

// MARK TASK AS COMPLETE
export function markTaskAsComplete(id) {
    const tasks = loadTasks()
    const taskIndex = tasks.findIndex(task => task.id == id)
    if (taskIndex === -1) {
        return { error: 'Task not found' }
    }
    if (tasks[taskIndex].status === 'Completed') {
        return { error: 'Task is already completed' }
    }

    tasks[taskIndex].status = 'Completed' // Set status to Completed
    tasks[taskIndex].completion_date = new Date().toISOString().split('T')[0] // Set completion date

    saveTasks(tasks) // Save updated task list
    return { successMsg: 'Task marked as complete' }
}

// MARK TASK AS CANCELLED
export function markTaskAsCancelled(id) {
    const tasks = loadTasks()
    const taskIndex = tasks.findIndex(task => task.id == id)

    if (taskIndex === -1) {
        return { error: 'Task not found' }
    }
    if (tasks[taskIndex].status === 'Cancelled') {
        return { error: 'Task is already cancelled' }
    }

    tasks[taskIndex].status = 'Cancelled' // Set status to Cancelled
    saveTasks(tasks) // Save updated task list
    return { successMsg: 'Task marked as cancelled' }
}

// FILTER TASKS
export function filterTasks({ username, search, status, due_date }) {
    let tasks = loadTasks().filter(task => task.user === username) // Filter tasks for the user

    return tasks.filter(task => {
        let match = true

        // Filter by search keyword (title or description)
        if (search) {
            match = task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
        }

        // Filter by task status
        if (status && task.status !== status) {
            match = false
        }

        // Filter by due date
        if (due_date) {
            match = task.due_date === due_date
        }

        return match
    })
}
