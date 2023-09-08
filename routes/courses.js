import {Router} from "express";
import Course from "../models/course.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.render('courses', {
        title: 'Courses',
        isCourses: true,
        courses
    });
})

router.get('/:id/edit', auth, async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }
    const course = await Course.findById(req.params.id);
    res.render('course-edit', {
        title: `Edit ${course.title}`,
        course
    })
})

router.post('/edit', auth, async (req, res) => {
    try {
        const {id} = req.body;
        delete req.body.id;
        await Course.findByIdAndUpdate(id, req.body);
        res.redirect('/courses');
    } catch (error) {
        console.error('Error while editing the course:', error);
        res.status(500).send('An error occurred while editing the course.');
    }
})

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
        });
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }

})

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})

export default router;