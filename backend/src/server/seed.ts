import { seedProducts } from "./seed-data";
import { Category, Inventory, OrderModel, Product } from "./models";

const stock: Record<string, number> = {
  "caramel-latte": 42,
  "black-iced": 28,
  "coffee-mocha": 6,
  "double-espresso": 55,
  tiramisu: 4,
  "house-beans": 18,
  "iced-caramel-macchiato": 24,
  "coffee-frappe": 9,
  "espresso-tonic": 0,
};

/** First run on an empty database: load the starter menu so the storefront isn't blank. */
export async function seedIfEmpty() {
  const [p, c, o] = await Promise.all([
    Product.estimatedDocumentCount(),
    Category.estimatedDocumentCount(),
    OrderModel.estimatedDocumentCount(),
  ]);
  if (p || c || o) return;
  const all = seedProducts;
  await Product.insertMany(
    all.map((x) => ({
      _id: x.id,
      name: x.name,
      description: x.description,
      price: x.price,
      category: x.category,
      image: x.image,
      notes: x.notes,
      roast: x.roast,
      best: x.best,
      status: "active",
    })),
  );
  await Inventory.insertMany(all.map((x) => ({ _id: x.id, stock: stock[x.id] ?? 20 })));
  await Category.insertMany([...new Set(all.map((x) => x.category))].map((name) => ({ name })));
}
