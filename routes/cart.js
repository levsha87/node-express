import {Router} from "express";
import Course from "../models/course.js";

const router = Router();

function mapCartItems(cart) {
    return cart.items.map(
        c => ({
            ...c.courseId._doc,
            id: c.courseId.id,
            count: c.count
        })
    )
}

function computeCoursesPrice(courses) {
    return courses.reduce((acc, course) => acc + course.price * course.count, 0)
}


router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);
    res.redirect('/cart');
})

router.get('/', async (req, res) => {
    const user = await req.user
        .populate('cart.items.courseId')

    const courses = mapCartItems(user.cart);

    res.render('cart', {
        title: 'Cart',
        isCart: true,
        courses,
        price: computeCoursesPrice(courses)
    })
})

router.delete('/remove/:id', async (req, res) => {
    await req.user.removeFromCart(req.params.id);
    const user = await req.user
        .populate('cart.items.courseId')

    const courses = mapCartItems(user.cart);
    const cart = {
        courses,
        price: computeCoursesPrice(courses)
    };

    res.status(200).json(cart);
})

export default router;