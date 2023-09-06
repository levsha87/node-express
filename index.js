import * as dotenv from "dotenv";
import express from 'express';
import mongoose from "mongoose";
import path from "path";
import {fileURLToPath} from 'node:url';
import Handlebars from 'handlebars';
import {create} from 'express-handlebars';
import {allowInsecurePrototypeAccess} from '@handlebars/allow-prototype-access';
import homeRoutes from './routes/home.js';
import addRoutes from './routes/add.js'
import coursesRoutes from "./routes/courses.js";
import cartRoutes from "./routes/cart.js";
import ordersRoutes from "./routes/orders.js"
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const hbs = create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

app.use(async (req, res, next) => {
    try {
        req.user = await User.findById('64f461c359f8af5d84a9e98e');
        next();
    } catch (e) {
        console.log(e);
    }
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))
app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

async function start() {
    const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

    await mongoose.connect(connectionUrl);
    const candidate = await User.findOne();
    if (!candidate) {
        const user = new User({
            email: 'test@gmail.com',
            name: 'Roma',
            cart: {items: []}
        })

        await user.save();
    }
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