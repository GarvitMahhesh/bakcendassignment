import jwt from 'jsonwebtoken';

export const authmiddleware = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        console.log('Token:', token); 
        console.log('Cookies:', req.cookies);  
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        
        req.user = decoded;

      
        next();

    } catch (error) {
        console.error("Error verifying token:", error.message);

     
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        return res.status(401).json({ message: 'Token is not valid' });
    }
};
