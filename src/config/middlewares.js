import passport from 'passport';
import { usersModel } from '../DAO/models/users.model.js';

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
        next();
    } else {
        res.redirect('/login');
    }
};

export const isAdminOrPremium = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.rol === 'admin' || req.user.rol === 'premium')) {
        next();
    } else {
        res.redirect('/login');
    }
};


// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Middleware de autenticación local con Passport
export const localAuthMiddleware = passport.authenticate('login', { failureRedirect: '/faillogin' });

// Middleware para la estrategia de GitHub con Passport
export const githubAuthMiddleware = passport.authenticate('github', { scope: ['user:email'] });

// Serialize y Deserialize user para Passport
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await usersModel.findById(id);
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error);
    }
});

export default passport;
