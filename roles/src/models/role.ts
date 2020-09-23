import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { SkillSchema, SkillDoc } from './subdocuments/skill';
import { QuestionDoc, QuestionSchema } from './subdocuments/question';
import { UserDoc } from './user';

enum RoleDescriptionType {
    Text = 'text',
    Link = 'link',
}

interface RoleDescriptionLink {
    url: string;
    type: RoleDescriptionType.Link;
}

interface RoleDescriptionText {
    text: string;
    type: RoleDescriptionType.Text;
}

interface RoleDescriptionItems
    extends Array<RoleDescriptionLink | RoleDescriptionText> {}

interface SkillArray extends Array<SkillDoc> {}

interface QuestionArray extends Array<QuestionDoc> {}

interface RoleAttrs {
    createdBy: string;
    descriptionItems?: RoleDescriptionItems;
    name: string;
    skills?: SkillArray;
    questions?: QuestionArray;
}

interface RoleDocBase extends mongoose.Document {
    // createdBy: string;
    descriptionItems: RoleDescriptionItems;
    name: string;
    version: number;
    skills?: SkillArray;
    questions?: QuestionArray;
    editors: Array<string>;
}

// interface RoleModel extends mongoose.Model<RoleDoc> {
//     build(attrs: RoleAttrs): RoleDoc;
// }

const RoleSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        descriptionItems: {
            type: Array,
            required: true,
            default: [],
        },
        name: {
            type: String,
            required: true,
        },
        skills: [SkillSchema],
        questions: [QuestionSchema],
        editors: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'User',
            },
        ],
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

// Export this for strong typing
export interface RoleDoc extends RoleDocBase {
    createdBy: UserDoc['_id'];
}

// Export this for strong typing
export interface RoleDoc_populated extends RoleDocBase {
    createdBy: UserDoc;
}

// Static methods
RoleSchema.statics.findWithMyCreatorById = async function (id: string) {
    return this.findById(id).populate('createdBy').exec();
};

RoleSchema.statics.findWithMyCreator = async function (args: any) {
    return this.find(args).populate('createdBy').populate('editors').exec();
};

// For model
export interface RoleModel extends mongoose.Model<RoleDoc> {
    // (method) Model<RoleDoc, {}>.find(callback?: ((err: any, res: RoleDoc[]) => void) | undefined): mongoose.DocumentQuery<RoleDoc[], RoleDoc, {}> (+4 overloads)
    findWithMyCreator(
        args: any,
    ): Promise<mongoose.DocumentQuery<RoleDoc[], RoleDoc, {}>>;
    findWithMyCreatorById(id: string): Promise<RoleDoc_populated>;
    build(attrs: RoleAttrs): RoleDoc;
}

RoleSchema.set('versionKey', 'version');
RoleSchema.plugin(updateIfCurrentPlugin);
RoleSchema.statics.build = (attrs: RoleAttrs) => {
    return new Role(attrs);
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', RoleSchema);

export { Role, RoleDescriptionType };
