/**
 * Models a User in the database
 */
import { Schema, model } from "mongoose";

type UserType = {
    username: string;
    password: string;
};
const UserSchema = new Schema<UserType>({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

const UserModel = model<UserType>("Users", UserSchema);

export default UserModel;
