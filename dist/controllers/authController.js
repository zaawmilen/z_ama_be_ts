"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt = require('bcryptjs');
const userModel_1 = require("../models/userModel");
const generateToken_1 = require("../utils/generateToken");
// Register a new user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield userModel_1.UserModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = yield userModel_1.UserModel.create({ name, email, password: hashedPassword });
        const token = (0, generateToken_1.generateToken)(newUser._id.toString());
        res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email, token });
    }
    catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});
exports.registerUser = registerUser;
// Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.UserModel.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = yield bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = (0, generateToken_1.generateToken)(user._id.toString());
        res.status(200).json({ id: user._id, name: user.name, email: user.email, token });
    }
    catch (err) {
        res.status(500).json({ message: 'Error logging in' });
    }
});
exports.loginUser = loginUser;
