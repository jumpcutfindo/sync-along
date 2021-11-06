/**
 * Repository Layer for the User Management system
 * Interacts with the UserModel in the database to retrieve User Data.
 */

import bcrypt from "bcrypt";
import User from "./model";

const SALT_NO_ROUNDS = 10;

class UserRepo {
    static async addUser(username, password) {
        try {
            const hashedPassword = await bcrypt.hash(password, SALT_NO_ROUNDS);
            const newlyCreatedUser = await User.create({
                username,
                password: hashedPassword,
            });
            return newlyCreatedUser;
        } catch (err) {
            throw err;
        }
    }

    static async doesUserExist(username) {
        return new Promise((resolve, reject) =>
            User.exists({ username })
                .then((doesUserExist) => resolve(doesUserExist))
                .catch((err) => reject(err))
        );
    }
}

export default UserRepo;
