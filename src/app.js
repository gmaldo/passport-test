import express from 'express'
import mongoose from 'mongoose'
import session, { Cookie } from 'express-session'
import bodyParser from 'body-parser'
import handlebars from 'express-handlebars'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import dotenv from 'dotenv'
import __dirname from "./utils.js"
import userRouter from './routes/user.router.js'
import initializePassport from './config/passport.config.js'
import cookieParser from 'cookie-parser'
const app = express()
const port = 8080
dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const enviroment = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Conectado a la base de datos")
    }catch(error){
        console.log("Error al conectar a la base de datos")
        console.log(error.message)
    }
}

enviroment()

// app.use(session({
//     store: MongoStore.create({
//         mongoUrl:process.env.MONGO_URL,
//         ttl: 60
//     }),
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: false
// }))


app.use(cookieParser())
initializePassport()
app.use(passport.initialize())
//app.use(passport.session())

app.use('/',userRouter)


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
