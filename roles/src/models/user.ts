import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// an interface that describs the props that are required to create a user
interface UserAttrs {
    id: string;
    email: string;
    name: string;
    organization: {
        id: string;
        name?: string;
    };
}

// an interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the props that a User document has
export interface UserDoc extends mongoose.Document {
    email: string;
    name: string;
    organization: {
        id: string;
        name?: string;
    };
    version: number;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        organization: {
            id: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: false,
            },
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

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
