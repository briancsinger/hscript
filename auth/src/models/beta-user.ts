import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// an interface that describs the props that are required to create a betaUser
interface BetaUserAttrs {
    email: string;
}

// an interface that describes the properties that a Beta User model has
interface BetaUserModel extends mongoose.Model<BetaUserDoc> {
    build(attrs: BetaUserAttrs): BetaUserDoc;
}

// an interface that describes the props that a BetaUser document has
export interface BetaUserDoc extends mongoose.Document {
    email: string;
    version: number;
}

const betaUserSchema = new mongoose.Schema(
    {
        email: {
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
            versionKey: false,
        },
    },
);

betaUserSchema.set('versionKey', 'version');
betaUserSchema.plugin(updateIfCurrentPlugin);

betaUserSchema.statics.build = (attrs: BetaUserAttrs) => {
    return new BetaUser(attrs);
};

const BetaUser = mongoose.model<BetaUserDoc, BetaUserModel>(
    'BetaUser',
    betaUserSchema,
);

export { BetaUser };
