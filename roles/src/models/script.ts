import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { SkillSchema, SkillDoc } from './subdocuments/skill';
import { QuestionDoc, QuestionSchema } from './subdocuments/question';

interface ScriptText {
    text: string;
}

interface ScriptItems extends Array<QuestionDoc | ScriptText> {}

interface ScriptAttrs {
    createdBy: string;
    items?: ScriptItems;
    role: string;
    name: string;
}

interface ScriptDoc extends mongoose.Document {
    createdBy: string;
    items: ScriptItems;
    role: string;
    name: string;
    version: number;
}

interface ScriptModel extends mongoose.Model<ScriptDoc> {
    build(attrs: ScriptAttrs): ScriptDoc;
}

const ScriptSchema = new mongoose.Schema(
    {
        createdBy: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
            default: [],
        },
        role: {
            type: String,
            required: true,
        },
        name: {
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

ScriptSchema.set('versionKey', 'version');
ScriptSchema.plugin(updateIfCurrentPlugin);
ScriptSchema.statics.build = (attrs: ScriptAttrs) => {
    return new Script(attrs);
};

const Script = mongoose.model<ScriptDoc, ScriptModel>('Script', ScriptSchema);

export { Script };
