require('dotenv').config();
const UserData = require('../model/UserSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/** GET: http://localhost:8080/api/users */
exports.users = async function (req, res) {
    try {
        const users = await UserData.find(); // Use 'find()' method to get all users

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        // Remove the password field from each user before sending the response
        const sanitizedUsers = users.map(user => {
            const { password, ...userDataWithoutPassword } = user.toObject();
            return userDataWithoutPassword;
        });

        return res.status(200).json({ usersData: sanitizedUsers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error while fetching user data.' });
    }
};
