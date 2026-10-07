"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Banknote, CreditCard, Landmark, Loader2, Store, Truck, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { formatPrice } from "@/lib/coffee-data";
import { keyOf, useCart } from "@/lib/store/cart-context";
import { EXPRESS_FEE } from "@/lib/pricing";
import { createOrder } from "@/lib/store/repo";
import { AnimatedPrice, SectionHeading } from "@/components/coffee/motion-primitives";
import { Field, TextInput, inputClass } from "@/components/coffee/Field";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{8,}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(5, "Enter your street address"),
  city: z.string().trim().min(2, "Enter your city"),
  postalCode: z.string().trim(),
  notes: z.string().trim(),
  deliveryMethod: z.enum(["standard", "express", "pickup"]),
  paymentMethod: z.enum(["cod", "card", "bank"]),
});
type FormValues = z.infer<typeof schema>;

const delivery = [
  { id: "standard", label: "Standard", hint: "2–3 days", icon: Truck },
  { id: "express", label: "Express", hint: "Same day", icon: Zap },
  { id: "pickup", label: "Pickup", hint: "Free · in café", icon: Store },
] as const;

const payment = [
  { id: "cod", label: "Cash on delivery", hint: "Pay when it arrives", icon: Banknote },
  { id: "card", label: "Card", hint: "Secure online payment", icon: CreditCard },
  { id: "bank", label: "Bank transfer", hint: "We'll email details", icon: Landmark },
] as const;

export function CheckoutView() {
  const cart = useCart();
  const router = useRouter();
  const placed = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      line1: "",
      city: "Karachi",
      postalCode: "",
      notes: "",
      deliveryMethod: "standard",
      paymentMethod: "cod",
    },
  });

  // nothing to pay for → back to the cart
  useEffect(() => {
    if (cart.hydrated && cart.lines.length === 0 && !placed.current) router.replace("/cart");
  }, [cart.hydrated, cart.lines.length, router]);

  const method = watch("deliveryMethod");
  const fee = method === "pickup" ? 0 : method === "express" ? EXPRESS_FEE : cart.deliveryFee;
  const total = cart.subtotal - cart.discount + fee;

  const onSubmit = async (v: FormValues) => {
    try {
      const order = await createOrder({
        items: cart.lines.map((l) => ({ productId: l.productId, qty: l.qty, size: l.size })),
        promo: cart.promo,
        address: {
          fullName: v.fullName,
          phone: v.phone,
          email: v.email,
          line1: v.line1,
          city: v.city,
          postalCode: v.postalCode,
          notes: v.notes,
        },
        paymentMethod: v.paymentMethod,
        deliveryMethod: v.deliveryMethod,
      });
      placed.current = true;
      cart.clear();
      toast.success(`Order ${order.reference} placed`);
      router.push(`/order-confirmation/${order.id}`);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "We couldn't place your order. Please try again.",
      );
    }
  };

  if (!cart.hydrated || cart.lines.length === 0) return <div className="min-h-[50vh]" />;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <SectionHeading eyebrow="Almost there" title="Checkout" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]"
      >
        <div className="space-y-8">
          <Card title="Contact & address">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <TextInput
                  autoComplete="name"
                  aria-invalid={!!errors.fullName}
                  {...register("fullName")}
                />
              </Field>
              <Field label="Phone" error={errors.phone?.message}>
                <TextInput
                  type="tel"
                  autoComplete="tel"
                  placeholder="+92 300 1234567"
                  aria-invalid={!!errors.phone}
                  {...register("phone")}
                />
              </Field>
              <Field label="Email" error={errors.email?.message} className="sm:col-span-2">
                <TextInput
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </Field>
              <Field label="Street address" error={errors.line1?.message} className="sm:col-span-2">
                <TextInput
                  autoComplete="address-line1"
                  aria-invalid={!!errors.line1}
                  {...register("line1")}
                />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <TextInput
                  autoComplete="address-level2"
                  aria-invalid={!!errors.city}
                  {...register("city")}
                />
              </Field>
              <Field label="Postal code (optional)">
                <TextInput autoComplete="postal-code" {...register("postalCode")} />
              </Field>
              <Field label="Order notes (optional)" className="sm:col-span-2">
                <textarea rows={3} className={inputClass} {...register("notes")} />
              </Field>
            </div>
          </Card>

          <Card title="Delivery">
            <Choices
              name="deliveryMethod"
              options={delivery}
              register={register}
              price={(id) =>
                id === "pickup"
                  ? "Free"
                  : id === "express"
                    ? formatPrice(EXPRESS_FEE)
                    : cart.deliveryFee === 0
                      ? "Free"
                      : formatPrice(cart.deliveryFee)
              }
            />
          </Card>

          <Card title="Payment">
            <Choices name="paymentMethod" options={payment} register={register} />
            <p className="mt-3 text-xs text-muted-foreground">
              Payments are a preview for now — no card is charged.
            </p>
          </Card>
        </div>

        <aside className="h-fit space-y-4 rounded-4xl border border-border/60 bg-card p-5 shadow-soft sm:p-6 lg:sticky lg:top-28">
          <h2 className="text-2xl">Your order</h2>
          <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.lines.map((l) => (
              <li key={keyOf(l)} className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={l.image}
                    alt=""
                    width={768}
                    height={880}
                    className="size-14 rounded-xl object-cover"
                  />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {l.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  {l.size && <p className="text-xs text-muted-foreground">{l.size}</p>}
                </div>
                <span className="text-sm font-medium">{formatPrice(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(cart.subtotal)}</dd>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount ({cart.promo})</dt>
                <dd>− {formatPrice(cart.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>{fee === 0 ? "Free" : formatPrice(fee)}</dd>
            </div>
          </dl>
          <div className="flex items-baseline justify-between border-t border-border pt-4">
            <span className="font-medium">Total</span>
            <AnimatedPrice value={total} className="font-display text-3xl" />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-ember flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Placing order…
              </>
            ) : (
              "Place order"
            )}
          </motion.button>
          <Link
            href="/cart"
            className="block text-center text-sm font-medium text-muted-foreground hover:text-accent"
          >
            ← Back to cart
          </Link>
        </aside>
      </form>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      className="rounded-4xl border border-border/60 bg-card p-4 shadow-soft sm:p-6"
    >
      <h2 className="mb-5 text-2xl">{title}</h2>
      {children}
    </motion.div>
  );
}

function Choices<T extends string>({
  name,
  options,
  register,
  price,
}: {
  name: "deliveryMethod" | "paymentMethod";
  options: readonly {
    id: T;
    label: string;
    hint: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  register: ReturnType<typeof useForm<FormValues>>["register"];
  price?: (id: T) => string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <label
          key={o.id}
          className="relative flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 transition-all sm:flex-col sm:items-start sm:gap-1 hover:-translate-y-0.5 has-[:checked]:border-accent has-[:checked]:bg-accent/5 has-[:checked]:ring-4 has-[:checked]:ring-accent/10 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/30"
        >
          <input type="radio" value={o.id} className="sr-only" {...register(name)} />
          <o.icon className="size-5 shrink-0 text-accent" />
          <span className="flex flex-1 flex-col sm:mt-1 sm:flex-none">
            <span className="text-sm font-semibold">{o.label}</span>
            <span className="text-xs text-muted-foreground">{o.hint}</span>
          </span>
          {price && <span className="text-xs font-semibold sm:mt-1">{price(o.id)}</span>}
        </label>
      ))}
    </div>
  );
}
