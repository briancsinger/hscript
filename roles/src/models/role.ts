import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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

interface RoleAttrs {
    createdBy: string;
    descriptionItems: RoleDescriptionItems;
    name: string;
}

interface RoleDoc extends mongoose.Document {
    createdBy: string;
    descriptionItems: RoleDescriptionItems;
    name: string;
    version: number;
}

interface RoleModel extends mongoose.Model<RoleDoc> {
    build(attrs: RoleAttrs): RoleDoc;
}

const RoleSchema = new mongoose.Schema(
    {
        createdBy: {
            type: String,
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

RoleSchema.set('versionKey', 'version');
RoleSchema.plugin(updateIfCurrentPlugin);
RoleSchema.statics.build = (attrs: RoleAttrs) => {
    return new Role(attrs);
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', RoleSchema);

export { Role, RoleDescriptionType };
