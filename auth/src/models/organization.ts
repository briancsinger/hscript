import mongoose from 'mongoose';

import { Password } from '../services/password';
import { UserDoc } from './user';

// an interface that describs the props that are required to create a organization
interface OrganizationAttrs {
    name?: string;
    owners?: UserDoc[];
}

// an interface that describes the properties that a Organization model has
interface OrganizationModel extends mongoose.Model<OrganizationDoc> {
    build(attrs: OrganizationAttrs): OrganizationDoc;
}

// an interface that describes the props that a Organization document has
export interface OrganizationDoc extends mongoose.Document {
    name: string;
    owners: UserDoc[];
}

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        owners: [
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
                delete ret.password;
            },
            versionKey: false,
        },
    },
);

organizationSchema.statics.build = (attrs: OrganizationAttrs) => {
    return new Organization(attrs);
};

const Organization = mongoose.model<OrganizationDoc, OrganizationModel>(
    'Organization',
    organizationSchema,
);

export { Organization };
