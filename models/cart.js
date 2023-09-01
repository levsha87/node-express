import path from "path";
import fs from "fs";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const p = path.join(__dirname, '..', 'data', 'cart.json');
export default class Cart {
    static async add(course) {
        const cart = await Cart.fetch();
        const idx = cart.courses.findIndex(c => c.id === course.id)
        const candidate = cart.courses[idx];

        if (candidate) {
            candidate.count++;
            cart.courses[idx] = candidate;
        } else {
            course.count = 1;
            cart.courses.push(course);
        }

        cart.price += +course.price;

        try {
            return await fs.promises.writeFile(
                p, JSON.stringify(cart), 'utf-8'
            )
        } catch (err) {
            throw err;
        }
    }

    static async fetch() {
        try {
            const content = await fs.promises.readFile(
                p,
                'utf-8'
            );
            return JSON.parse(content);
        } catch (error) {
            throw error;
        }
    }
}