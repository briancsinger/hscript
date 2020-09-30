import mongoose from 'mongoose';

interface SkillSubDoc extends mongoose.Document {
    text: string;
}

const SkillSubSchema = new mongoose.Schema(
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

export { SkillSubDoc, SkillSubSchema };
