import {Router} from "express";

const router = Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Main page',
        isHome: true
    })
})

export default router;