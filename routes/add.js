import {Router} from "express";
import Course from "../models/course.js";

const router = Router();

router.get('/', (req, res) => {
    res.render('add', {
        title: 'Add course',
        isAdd: true
    });
})

router.post('/', async (req, res) => {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user
    })

    try {
        await course.save();
        res.redirect('/courses')
    } catch (e) {
        console.log(e);
    }
})

export default router;