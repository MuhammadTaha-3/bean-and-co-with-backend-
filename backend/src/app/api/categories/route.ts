import { z } from "zod";
import { Category } from "@/server/models";
import { requireAdmin } from "@/server/auth";
import { HttpError, body, escapeRe, ok, route } from "@/server/http";

export const GET = route(async () =>
  ok((await Category.find().sort({ createdAt: 1 }).lean()).map((c) => c.name)),
);

export const POST = route(async (req) => {
  await requireAdmin(req);
  const { name } = z
    .object({ name: z.string().trim().min(1, "Name is required") })
    .parse(await body(req));
  if (await Category.exists({ name: new RegExp(`^${escapeRe(name)}$`, "i") }))
    throw new HttpError(409, "That category already exists");
  await Category.create({ name });
  return ok({ name }, 201);
});
