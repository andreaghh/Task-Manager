import fs from 'fs'
import path from 'path'

const tasksFilePath = path.join('./data', 'tasks.json')

const loadTasks = () => {
    try{
        const data = fs.readFileSync(tasksFilePath, 'utf8')
        return JSON.parse(data)
    }catch(error){
        console.error('error loading tasks', error)
        return []
    }
}

export const getAllTasks = () => {
    return loadTasks()
}

export const getTaskByUser= (username) => {
    const tasks= loadTasks()
    return tasks.filter((task) => task.user === username)
}

// Register a new task
export function registerTask(task, registrationLogic) {
    const { title, description, due_date, priority, status, user } = task;
    const successMsg = registrationLogic({ title, description, due_date, priority, status, user });
    return { successMsg };
}