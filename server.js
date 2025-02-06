import express from 'express'
import path from 'path'
import {engine} from 'express-handlebars'
import {findOrCreate} from "./models/user.js";


const PORT = process.env.PORT || 3000;
//define and create an instance of the server
const server = express();

//setting up handlebars
server.engine('handlebars', engine())
server.set('view engine', 'handlebars')
server.set('views','./views')

//setup static files
server.use(express.static(import.meta.dirname+ 'public'))

// Get current directory path
/*const __dirname = path.dirname(new URL(import.meta.url).pathname);
console.log('Public route:', path.join(__dirname, 'public'));

// Serve static files from folder 'public'
server.use(express.static(path.join(__dirname, 'public')));*/

//Parse form data
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//Routes
server.get('/', (req, res, next) => {
    res.render('login')
})

server.post('/login', (req, res) => {
    const {name, username } = req.body
    if (!name || !username) {
        return res.render('login', {error: 'Username and/or name required'})
    }
    const user = findOrCreate({name, username})
    res.redirect(`/home?username=${username}`)
})

//ERROR HANDLING

server.use((req,res,next) =>{
    res.render('404')
})

server.use((err,req,res)=>{
    res.render('500')
})

//Start the server
server.listen(PORT,()=> console.log(`server  running and listening to port ${PORT}`))