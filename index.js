import * as dotenv from "dotenv";
import express from 'express';
import mongoose from "mongoose";
import path from "path";
import {fileURLToPath} from 'node:url';
import Handlebars from 'handlebars';
import {create} from 'express-handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import session from 'express-session';
import {default as connectMongoDBSession} from 'connect-mongodb-session';

import homeRoutes from './routes/home.js';
import addRoutes from './routes/add.js'
import coursesRoutes from "./routes/courses.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js"
import authRoutes from "./routes/auth.js"

import User from "./models/user.js";
import varMiddleware from "./middleware/variables.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
const MongoStore =connectMongoDBSession(session);


const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;
const app = express();
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
const store = new MongoStore({
    collection: 'sessions',
    uri: connectionUrl,

})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret:'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    await mongoose.connect(connectionUrl);
}

await start();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})