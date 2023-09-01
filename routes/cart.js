import {Router} from "express";
import Cart from "../models/cart.js";
import Course from "../models/course.js";

const router = Router();

router.post('/add', async (req, res) => {
    const course = await Course.getById(req.body.id);

    await Cart.add(course);
    res.redirect('/cart');
})

router.get('/', async (req, res) => {
    const cart = await Cart.fetch();

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses: cart.courses,
        price: cart.price
    })
})

export default router;