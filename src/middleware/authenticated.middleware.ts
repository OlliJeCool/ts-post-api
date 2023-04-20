import { Request, Response, NextFunction } from "express";  
import { verifyToken } from "../utils/interfaces/token";
import userModel from "../resources/user/user.model";
import Token from "../utils/interfaces/token.interface";
import HttpException from "../utils/exceptions/http.exception";
import jwt from 'jsonwebtoken';


async function authenticatedMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response | void>{
    const barer = req.headers.authorization;

    if(!barer || barer.startsWith('Bearer ')){
        return next(new HttpException(401, 'Unauthorised'));
    }

    const accessToken = barer.split('Bearer ')[1].trim();

    try {
        const payload: Token |  jwt.JsonWebTokenError = await verifyToken(accessToken);

        if(payload instanceof jwt.JsonWebTokenError){
            return next(new HttpException(401, 'Unauthorised'));
        }

        const user = await userModel.findById(payload.id).select('-password').exec()
        if(!user){
            return next(new HttpException(401, 'Unauthorised'));
        }

        req.user = user;
        return next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorised'));
    }
}

export default authenticatedMiddleware