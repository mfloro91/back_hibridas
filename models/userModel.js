import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema( {
    hotel_id: {
        type: Schema.Types.ObjectId, ref:'Hotel',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
    },
        role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

export default mongoose.model('User', userSchema);