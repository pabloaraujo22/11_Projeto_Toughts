const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

const app = express()
const conn = require('./db/conn')

//Models
const User = require('./models/User')
const Tought = require('./models/Tought')

//Routes
const toughtRoutes = require('./routes/toughtRoutes')
const ToughtController = require('./controllers/ToughtController')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//receber resposta do body
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//session middleware
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false, //false - caiu a sessao ele desconecta
    saveUninitialized: false,
    store: new FileStore({
        logFn: function() {},
        path: require('path').join(require('os').tmpdir(), 'session') //caminho temporario para acessar sessao
    }),
    cookie: {
        secure: false,
        maxAge: 360000, //deixa de ser valido
        expires: new Date(Date.now() + 360000), //expira autamaticamente
        httpOnly: true, //true - por usar http e nao https SSL
    }
}))

//flash messages
app.use(flash())

//public path
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session
    }

    next()
})

app.use('/toughts', toughtRoutes)
app.get('/', ToughtController.showToughts)

conn.sync()
    .then(() => app.listen(3000))
    .catch((err) => console.log(err))