const expressEdge = require('express-edge')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')

const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require('./controllers/createUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')

const app = new express()

const mongoStore = connectMongo(expressSession)

app.use(expressSession({

  secret: 'secret',

  store: new mongoStore({

    mongooseConnection: mongoose.connection

  })

}))


app.use(fileUpload())
app.use(express.static('public'))
app.use(expressEdge)
app.set('views', `${__dirname}/views`)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storePost = require('./middleware/storePost')

const auth = require('./middleware/auth')

app.use('/posts/store', storePost)
app.get('/', homePageController)
app.get('/posts/new', auth, createPostController)
app.post('/posts/store', auth, storePost, storePostController )
app.get('/post/:id', getPostController )
app.get('/auth/login', loginController)
app.post('/users/login', loginUserController)
app.get('/auth/register', createUserController)
app.post('/users/register', storeUserController)


app.listen(4000, () => {
  console.log('App listening on port 4000')

})
