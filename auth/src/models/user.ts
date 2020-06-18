import mongoose from 'mongoose';

import { Password } from '../services/password';
import { OrganizationDoc } from './organization';

// an interface that describs the props that are required to create a user
interface UserAttrs {
    email: string;
    name: string;
    organization: OrganizationDoc;
    password: string;
}

// an interface that describes the properties that a User model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// an interface that describes the props that a User document has
export interface UserDoc extends mongoose.Document {
    email: string;
    name: string;
    organization: OrganizationDoc;
    password: string;
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
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

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await Password.toHash(this.get('password'));
        this.set('password', hashedPassword);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
