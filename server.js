import express from 'express'
import {engine} from 'express-handlebars'


const PORT = process.env.PORT || 3000;
//define and create an instance of the server
const server = express();

server.engine('handlebars', engine())
server.set('view engine', 'handlebars')

//define views directory
server.set('views','./views')







//ERROR HANDLING

server.use((req,res,next) =>{
    res.render('404')
})

server.use((err,req,res)=>{
    res.render('500')
})

//Start the server
server.listen(PORT, () => console.log(`server  running and listening to port ${PORT}`))