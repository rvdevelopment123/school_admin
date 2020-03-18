import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as morgan from 'morgan'
import * as mongoose from 'mongoose'
import setRoutes from './routes'
import { seedDatabase, staticPath, uploadDir } from './config'
const compression = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const app = require('express')();
const http = require('http').Server(app);
const helmet = require('helmet')
const fs = require('fs');

dotenv.config()
app.set('serverport', (process.env.SERVERPORT || 9000));

app.use(express.static(staticPath))
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(morgan('dev'))

let passport = require('passport');
app.use(passport.initialize());

const fsx = require('fs-extra');
try {
  if (!fs.existsSync(uploadDir + 'tmp'))
    fsx.ensureDirSync(uploadDir + 'tmp');
} catch (e) { }
try {
  if (!fs.existsSync(uploadDir + 'img'))
    fsx.ensureDirSync(uploadDir + 'img');
} catch (e) { }

app.disable('x-powered-by');

var options = { useMongoClient: true, keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 }
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vuefull', options)
const db = mongoose.connection;
(<any>mongoose).Promise = global.Promise
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  if (seedDatabase)
    require('./seed') // Seed database with some sample data if it config says so
  setRoutes(app);
  http.listen(app.get('serverport'), () => {
    console.log('App listening on port ' + app.get('serverport'));
  });
})

export { app };
