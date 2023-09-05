import {Router} from "express";
import Order from "../models/order.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id,
        })
            .populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Orders',
            orders: orders.map(order => {
                return {
                    ...order._doc,
                    price: order.courses.reduce((acc, order) => {
                        return acc += order.course.price * order.count
                    }, 0)
                }
            })
        })
    } catch (e) {
        console.log(e);
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await req.user
            .populate('cart.items.courseId');

        const courses = user.cart.items.map(item => ({
            count: item.count,
            course: {...item.courseId._doc},
        }))

        const order = new Order({
            courses,
            user: {
                name: req.user.name,
                userId: req.user,
            }
        })

        await order.save();
        await req.user.clearCart();

        res.redirect('/orders');
    } catch (e) {
        console.log(e);
    }
})

export default router;