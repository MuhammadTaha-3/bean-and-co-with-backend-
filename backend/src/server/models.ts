import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { ORDER_FLOW } from "@/lib/types";

const model = <T>(name: string, schema: Schema<T>): Model<T> =>
  (mongoose.models[name] as Model<T> | undefined) ?? mongoose.model<T>(name, schema);

/** Products — _id is the public product id/slug the storefront already uses. */
const productSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, index: true },
    image: { type: String, default: "" },
    status: { type: String, enum: ["active", "draft", "archived"], default: "active", index: true },
    notes: String,
    roast: String,
    best: Boolean,
    sku: String,
    discount: { type: Number, min: 0, max: 100, default: 0 },
    variants: [{ _id: false, label: String, price: Number }],
  },
  { timestamps: true },
);
export const Product = model("Product", productSchema);

const categorySchema = new Schema(
  { name: { type: String, required: true, unique: true, trim: true } },
  { timestamps: true },
);
export const Category = model("Category", categorySchema);

/** Inventory — one record per product; the only place stock lives. */
const inventorySchema = new Schema(
  {
    _id: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);
export const Inventory = model("Inventory", inventorySchema);

const orderSchema = new Schema(
  {
    _id: { type: String, required: true }, // unguessable id used in the confirmation URL
    reference: { type: String, required: true, unique: true }, // customer-facing Order / Tracking ID
    status: { type: String, enum: [...ORDER_FLOW, "Cancelled"], default: "Placed", index: true },
    history: [{ _id: false, status: String, at: Date }],
    items: [
      { _id: false, productId: String, name: String, price: Number, image: String, qty: Number },
    ],
    subtotal: Number,
    deliveryFee: Number,
    discount: { type: Number, default: 0 },
    total: Number,
    address: {
      fullName: String,
      phone: String,
      email: String,
      line1: String,
      city: String,
      postalCode: String,
      notes: String,
    },
    paymentMethod: { type: String, enum: ["cod", "card", "bank"] },
    deliveryMethod: { type: String, enum: ["standard", "express", "pickup"] },
    customerEmail: { type: String, index: true },
  },
  { timestamps: true },
);
export const OrderModel = model("Order", orderSchema);

const adminSchema = new Schema(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true } },
  { timestamps: true },
);
export const Admin = model("Admin", adminSchema);

export type ProductDoc = InferSchemaType<typeof productSchema> & { _id: string; createdAt?: Date };
export type OrderDoc = InferSchemaType<typeof orderSchema> & { _id: string; createdAt: Date };
