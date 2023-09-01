import {v4 as uuidv4} from 'uuid';
import fs from 'fs';
import path from "path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default class Course {
    constructor(title, price, img) {
        this.title = title
        this.price = price
        this.img = img
        this.id = uuidv4();
    }

    toJSON() {
        return {
            title: this.title,
            price: this.price,
            img: this.img,
            id: this.id
        }
    }

    static async update(course){
        const courses = await Course.getAll();
        const idx = courses.findIndex(c => c.id ===course.id);
        courses[idx] = course;
        try {
            await fs.promises.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), 'utf-8'
            )
        } catch (err) {
            throw err;
        }
    }

    async save() {
        const courses = await Course.getAll();
        courses.push(this.toJSON());
        try {
            await fs.promises.writeFile(
                path.join(__dirname, '..', 'data', 'courses.json'), JSON.stringify(courses), 'utf-8'
            )
        } catch (err) {
            throw err;
        }
    }

    // static getAll() {
    //     return new Promise(
    //         (resolve, reject) => {
    //             fs.readFile(
    //                 path.join(__dirname, '..', 'data', 'courses.json'), 'utf-8', async (err, content) => {
    //                     if (err) reject(err);
    //                     resolve(JSON.parse(content));
    //                 }
    //             );
    //         }
    //     );
    // }

    static async getAll() {
        try {
            const content = await fs.promises.readFile(
                path.join(__dirname, '..', 'data', 'courses.json'),
                'utf-8'
            );
            return JSON.parse(content);
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        const courses = await Course.getAll();
        return courses.find(c => c.id === id);
    }
}