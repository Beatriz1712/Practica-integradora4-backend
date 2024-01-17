import passport from 'passport'
import GithubStrategy from "passport-github2"
import local from 'passport-local'
import {createHash, isValidPassword } from '../utils.js'
import { usersModel } from '../DAO/models/users.model.js'
import { loginUser } from '../controllers/UserController.js'
import UserRepository from '../repositories/UserRepository.js'


const LocalStrategy = local.Strategy
const userRepository = new UserRepository()


const initializePassword = () => {


    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age, rol } = req.body
            try {
                const user = await userRepository.getUserByEmail(username);
                if (user) {
                    return done(null, false, { message: 'El usuario ya existe' });
                }


                const hashedPassword = await createHash(password);
      
            const newUser = {
              first_name,
              last_name,
              email,
              age,
              password: hashedPassword,
              rol
            };
      
            let result = await userRepository.createUser(newUser);

            return done(null, result);
          } catch (error) {
            return done("Error al obtener el usuario" + error);

            }
        }
    ));
    


    passport.serializeUser((user, done) => {
        done(null, user._id)
    })


    passport.deserializeUser(async (id, done) => {
        try {
            let user = await usersModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializing user:", error);
            done(error);
        }
    });



    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username });
    
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
    
            const isValid = await isValidPassword(password, user.password);
    
            if (!isValid) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
    
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
    

    passport.use("github", new GithubStrategy({
        clientID: "Iv1.10a217b7a536d867",
        clientSecret: "3d7f062f6938bd319359886e11e51e95afbd3c63",
        callbackURL: "http://localhost:8080/api/user/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            if (profile.emails && profile.emails.length > 0) {
                const email = profile.emails[0].value;
                let user = await usersModel.findOne({ email: email });

                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        age: 20,
                        email: email,
                        password: "",
                        rol: "admin"
                    };
                    let result = await usersModel.create(newUser);
                    done(null, result);
                } else {
                    done(null, user);
                }
            } else {
                done("No se pudo obtener la dirección de correo electrónico desde GitHub", null);
            }
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassword