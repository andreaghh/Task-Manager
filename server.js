import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'
import methodOverride from 'method-override'
import { findOrCreate } from './models/user.js'
import {
    registerToFile, addTask, getStatuses, getPriorities, loadTasks, updateTask, markTaskAsComplete, markTaskAsCancelled, filterTasks} from './models/task.js'

const PORT = process.env.PORT || 3000

// Create server instance
const server = express()

// Handlebars setup with partials and helpers
server.engine('handlebars', engine({
    partialsDir: './views/partials',
    helpers: {
        eq: (a, b) => a === b, // helper for equals
    },
}))
server.set('view engine', 'handlebars')
server.set('views', './views')

// Setup static files
server.use('/public', express.static(import.meta.dirname + '/public'))

// Session middleware
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

// Parse form data
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

// Method override for PUT and DELETE requests
server.use(methodOverride('_method'))

// Routes

// Home and Login Route
server.get('/', (req, res) => {
    if (req.session.user) {
        return res.redirect('/home')
    }
    res.render('login')
})

server.post('/login', (req, res) => {
    const { name, username } = req.body
    if (!name || !username) {
        return res.render('login', { error: 'Username and/or name required' })
    }
    const user = findOrCreate({ name, username })
    req.session.user = user
    res.redirect('/home')
})

// Logout Route
server.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/') // Redirect to login page after logout
    })
})

// Home Route
server.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/')
    }
    const { search, status, due_date } = req.query
    let tasks = filterTasks({
        username: req.session.user.username,
        search,
        status,
        due_date
    })
    res.render('home', {
        user: req.session.user,
        tasks,
        search,
        statuses: getStatuses(),
        priorities: getPriorities()
    })
})

// Add Task Routes
server.get('/tasks/add', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/')
    }
    res.render('task-form', {
        user: req.session.user,
        priorities: getPriorities(),
        statuses: getStatuses()
    })
})

server.post('/tasks/register', (req, res) => {
    const { title, description, due_date, priority, status, completion_date } = req.body
    if (!title || !description || !due_date || !status || !priority) {
        return res.render('task-form', {
            error: 'All fields are required',
            user: req.session.user,
            statuses: getStatuses(),
            priorities: getPriorities()
        })
    }
    const newTask = {
        title,
        description,
        due_date,
        priority,
        status,
        completion_date: completion_date || null,
        user: req.session.user.username,
    }
    const result = addTask(newTask, registerToFile)
    if (result.error) {
        return res.render('task-form', {
            error: result.error,
            user: req.session.user,
            task: newTask,
            statuses: getStatuses(),
            priorities: getPriorities()
        })
    }
    res.redirect('/home')
})

// Update Task Routes
server.get('/tasks/edit/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/')
    }
    const tasks = loadTasks()
    const task = tasks.find(t => t.id == req.params.id)
    if (!task) {
        return res.status(404).send('Task not found')
    }
    res.render('task-form', {
        task,
        priorities: getPriorities(),
        statuses: getStatuses(),
        isEdit: true,
    })
})

server.put('/tasks/update/:id', (req, res) => {
    const updatedTask = { id: req.params.id, ...req.body }
    const result = updateTask(updatedTask)
    if (result.error) {
        return res.status(404).json({ error: result.error })
    }
    res.redirect('/home')
})

// Mark Task as Complete
server.put('/tasks/complete/:id', (req, res) => {
    const result = markTaskAsComplete(req.params.id)
    if (result.error) {
        return res.status(404).send(result.error)
    }
    res.redirect('/home')
})

// Mark Task as Cancelled
server.put('/tasks/cancel/:id', (req, res) => {
    const result = markTaskAsCancelled(req.params.id)
    if (result.error) {
        return res.status(404).send(result.error)
    }
    res.redirect('/home')
})

// Error Handling Routes
server.use((req, res) => {
    res.render('404')
})

server.use((err, req, res) => {
    res.render('500')
})

// Start the server
server.listen(PORT, () => console.log(`Server running and listening on port ${PORT}`))
