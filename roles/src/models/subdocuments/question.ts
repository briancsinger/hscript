import mongoose from 'mongoose';

interface QuestionDoc extends mongoose.Document {
    text: string;
    skill?: string;
}

const QuestionSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        skill: {
            type: String,
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

export { QuestionDoc, QuestionSchema };
