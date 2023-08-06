require('dotenv').config()
const jwt = require('jsonwebtoken')

// Auth middleware
exports.Auth = async function (req, res, next) {
    try {
        // access authorized heaader to validate the request.
        const token = req.headers.authorization.split(' ')[1]
        // retrive the details of loged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
            if (err) {
                return 'token expired'
            }
            return res
        })
        if (decodedToken === 'token expired') return res.status(401).json({ message: 'token expired' })

        req.user = decodedToken
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Authentication Failed!' })
    }
}