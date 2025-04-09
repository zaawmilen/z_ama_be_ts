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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_1 = __importDefault(require("stripe"));
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config();
// Initialize Stripe
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
if (!stripe) {
    throw new Error('Stripe secret key is not defined in environment variables');
}
// Initialize Express app
const app = (0, express_1.default)();
// Connect to MongoDB
mongoose_1.default
    .connect(process.env.DB_URI || "", {
// useNewUrlParser: true,
// useUnifiedTopology: true,
})
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
// Use the logger middleware
app.use(logger_1.logger);
// CORS - restrict to frontend
app.use((0, cors_1.default)({ origin: 'https://z-eccom2.netlify.app' }));
// Middleware for parsing JSON
app.use(express_1.default.json());
// Use routes
app.use("/products", productRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/orders", orderRoutes_1.default);
app.use("/auth", authRoutes_1.default);
// Error handling middleware (should be last)
app.use(errorHandler_1.errorHandler);
// Stripe Payment Intent endpoint
app.post('/create-payment-intent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Invalid items array.' });
        }
        const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) * 100;
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send('Unable to create payment intent');
    }
}));
// Simple route
app.get('/', (req, res) => {
    res.status(200).send('Hello from the backend!');
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
