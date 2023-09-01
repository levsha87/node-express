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
    const course = new Course(req.body.title, req.body.price, req.body.img);
    await course.save();
    res.redirect('/courses')
})

export default router;