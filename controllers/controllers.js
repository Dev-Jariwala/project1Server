require('dotenv').config()
const UserData = require('../model/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


/** middleware for verify user */
exports.verifyUser = async function (req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserData.findOne({ username });
        if (!exist) {

            return res.status(404).send({ message: 'verifyUser: User not found.' })
        }
        next();

    } catch (error) {
        return res.status(404).send({ message: "verifyUser: Authentication Error" });
    }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}**/
exports.register = async function (req, res) {
    try {
        const { username, password, profile, email, coachName } = req.body;

        const existUsername = await UserData.findOne({ username });
        if (existUsername) {
            return res.status(409).json({ message: 'Username already taken.', field: 'username' });
        }

        const existEmail = await UserData.findOne({ email });
        if (existEmail) {
            return res.status(409).json({ message: 'Email already registered.', field: 'email' });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new UserData({
                username,
                password: hashedPassword,
                profile: profile || '',
                email,
                coachName: coachName || 'Manish_Khaptawala',
                isCoach: false,
                isAdmin: false
            });

            try {
                const userSaved = await user.save();
                return res.status(200).json({ message: 'User registered successfully.' });
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error saving user.' });
            }
        } else {
            return res.status(400).json({ message: 'Password is required.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unexpected error occurred.' });
    }
};

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
exports.login = async function (req, res) {
    try {
        const { username, password } = req.body;
        const user = await UserData.findOne({ username });
        if (user) {
            const correctPassword = await bcrypt.compare(password, user.password);
            if (correctPassword) {
                // create jwt token for log in
                const tokenExpireTime = 60 * 15
                const token = jwt.sign({
                    userId: user._id,
                    username: user.username,
                    isCoach: user.isCoach,
                    isAdmin: user.isAdmin,
                }, process.env.JWT_SECRET, { expiresIn: tokenExpireTime })
                return res.status(200).json({ message: 'Successfully logged in.', username: user.username, token, tokenExpireTime });

            } else {
                return res.status(401).json({ message: 'Invalid Password.' });
            }
        } else {
            return res.status(404).json({ message: 'Username not found.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unexpected error occurred.' });
    }
};

/** PUT: http://localhost:8080/api/updateuser?id=<userId>
 * @param: {
 *    firstName: '',
 *    address : '',
 *    profile : ''
 * }
 */
exports.updateUser = async function (req, res) {
    try {
        const { userId } = req.user;
        if (!userId) {
            return res.status(400).json({ message: 'id required.' });
        }

        const body = req.body;
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({ message: 'Request body is empty.' });
        }

        try {
            const user = await UserData.findByIdAndUpdate(userId, body, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({ message: 'Record Updated..!', user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error while updating user data.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unexpected error occurred.' });
    }
};

/** GET: http://localhost:8080/api/user/example123 */
exports.getUser = async function (req, res) {
    try {
        console.log('here')
        const { username } = req.params;
        if (!username) return res.status(400).json({ message: 'Username required.' });

        try {
            // Add a check to ensure that the authenticated user matches the requested username
            if (req.user.username !== username) {
                return res.status(403).json({ message: 'Unauthorized access.' });
            }
            const user = await UserData.findOne({ username });
            if (!user) return res.status(404).json({ message: 'User not found.' });

            // Remove the password field from the response before sending it
            const { password, ...userData } = user.toObject();

            return res.status(200).json({ user: userData });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error while fetching user data.' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unexpected error occurred.' });
    }
};