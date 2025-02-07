import express from 'express'
import {engine} from 'express-handlebars'
import {findOrCreate} from "./models/user.js";
import session from 'express-session'
import {getTaskByUser} from "./models/task.js";


const PORT = process.env.PORT || 3000;
//define and create an instance of the server
const server = express();

//Specify the partials directory
server.engine('handlebars', engine({
    partialsDir: './views/partials', //
}))

//setting up handlebars
server.engine('handlebars', engine())
server.set('view engine', 'handlebars')
server.set('views','./views')

//setup static files
server.use('/public',express.static(import.meta.dirname+ '/public', {

}))

//session middleware
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)

//Parse form data
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Routes
server.get('/', (req, res, next) => {
    if(req.session.user) {
        return res.redirect('/home')
    }
    res.render('login')
})

server.post('/login', (req, res) => {
    const {name, username } = req.body
    if (!name || !username) {
        return res.render('login', {error: 'Username and/or name required'})
    }
    //find or create a user
    const user = findOrCreate({name, username})

    //save the user in the session
    req.session.user = user

    res.redirect('/home')
})

server.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')// Redirect to login page after logout
    })
})

server.get('/home', (req, res) => {
    if (!req.session.user) {
        //redirect to login
        return res.redirect('/')
    }

    //fetch the user's tasks
    const tasks = getTaskByUser(req.session.user.username)
    res.render('home',{
        user: req.session.user,
        tasks
    })
})

server.get('/tasks/add', (req, res) => {
    // Check if the user is logged in
    if (!req.session.user) {
        return res.redirect('/'); // Redirect to login if not authenticated
    }

    // Render the task form
    res.render('task-form', {
        user: req.session.user, // Pass the logged-in user to the template if needed
    });
});

//ERROR HANDLING

server.use((req,res,next) =>{
    res.render('404')
})

server.use((err,req,res)=>{
    res.render('500')
})

//Start the server
server.listen(PORT,()=> console.log(`server  running and listening to port ${PORT}`))