import mongoose, {Schema} from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

CourseSchema.method('toClient', function () {
    const course = this.toObject();
    course.id = course._id;
    delete course._id;
    return course;
})

export default mongoose.model('Course', CourseSchema);

