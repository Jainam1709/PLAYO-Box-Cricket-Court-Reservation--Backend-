import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    turfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turf' }]
}, {
    timestamps: true
});

const Court = mongoose.model('Court', courtSchema);

export default Court;