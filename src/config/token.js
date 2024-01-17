import jwt  from "jsonwebtoken";

export function generateAndSetToken(res, email, password) {
    const token = jwt.sign({ email, password, role: "user"}, process.env.JWT_SECRET, { expiresIn: "1h"})
    res.cookie("token", token, {httpOnly: true, maxAge: 60 * 60 * 1000})
    return token
}

export function generatePasswordResetToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
}