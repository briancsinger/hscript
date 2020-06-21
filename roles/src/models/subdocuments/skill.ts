import mongoose from 'mongoose';

interface SkillDoc extends mongoose.Document {
    text: string;
}

const SkillSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    },
);

export { SkillDoc, SkillSchema };
