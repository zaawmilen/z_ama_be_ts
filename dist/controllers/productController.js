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
exports.createProduct = exports.getProducts = void 0;
const db_1 = __importDefault(require("../db")); // Assuming db is initialized as knex
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (0, db_1.default)("products").select("*");
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
});
exports.getProducts = getProducts;
// Add a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, price, stock } = req.body;
    try {
        const newProduct = yield (0, db_1.default)("products").insert({ name, description, price, stock });
        res.status(201).json({ id: newProduct[0], name, description, price, stock });
    }
    catch (error) {
        res.status(500).json({ error: "Error creating product" });
    }
});
exports.createProduct = createProduct;
