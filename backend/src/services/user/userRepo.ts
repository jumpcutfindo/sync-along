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

    static async checkUserCredentials(username, password) {
        try {
            const newlyCreatedUser = await User.findOne({ username });
            if (!newlyCreatedUser) {
                return false;
            }
            const validPassword = await bcrypt.compare(password, newlyCreatedUser.password);
            return validPassword;
        } catch (err) {
            throw err;
        }
    }
}

export default UserRepo;
