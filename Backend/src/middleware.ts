import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express'
export const middleware = (req: Request, res: Response, next: NextFunction) => {
        const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
        if(JWT_SECRET_KEY === undefined){
            throw new Error("JWT_SECRET_KEY is not defined");
        }
        const token = req.headers.cookie?.split("token=")[1];
        if(!token){
            res.status(401).json({
                message : "User not logged in"
            })
            return;
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY);
            req.body.voterId = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token, authentication failed" });
            return;
        }
        
}