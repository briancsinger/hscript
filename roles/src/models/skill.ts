import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface SkillAttrs {
    organizationId?: string;
    text: string;
    tags?: [string];
    uses: number;
    createdBy?: string;
}

interface SkillDoc extends mongoose.Document {
    organizationId?: string;
    text: string;
    uses: number;
    tags?: [string];
    version: number;
    createdBy?: string;
}

interface SkillModel extends mongoose.Model<SkillDoc> {
    build(attrs: SkillAttrs): SkillDoc;
}

const SkillSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            required: false,
        },
        organizationId: {
            type: mongoose.Types.ObjectId,
            required: false,
        },
        tags: {
            type: [String],
            required: false,
        },
        text: {
            type: String,
            required: true,
        },
        uses: {
            type: Number,
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

SkillSchema.set('versionKey', 'version');
SkillSchema.plugin(updateIfCurrentPlugin);
SkillSchema.statics.build = (attrs: SkillAttrs) => {
    return new Skill(attrs);
};

const Skill = mongoose.model<SkillDoc, SkillModel>('Skill', SkillSchema);

export { Skill };
