import userModel from "./user.model";
import token from "../../utils/interfaces/token";

class UserService {
    private user = userModel;

    public async register(name: string, email: string, password: string, role: string): Promise<string | Error> {
        try {
            const user = await this.user.create({name, email, password, role})
            
            const accessToken = token.createToken(user);
            return accessToken;
        } catch (error) {
            throw new Error('Unable to create user.')
        }
    }

    public async login(email: string, password: string): Promise<string | Error>{
        try {
            const user = await this.user.findOne({email});
            
            if(!user){
                throw new Error('Unable to find user with that email')
            }

            if(await user.isValidPassword(password)){
                return token.createToken(user);
            }
            else{ 
                throw new Error('Wrong credentials');
            }
        } catch (error) {
            throw new Error('Unable to log in user');
        }
    }
}


export default UserService;