"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { z } from "zod";

const CheckoutSchema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
});

export type CheckoutState = {
  errors?: {
    eventId?: string[];
    name?: string[];
    email?: string[];
    _form?: string[];
  };
};

export async function createCheckoutSession(
  _prevState: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = CheckoutSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors as CheckoutState["errors"],
    };
  }

  const { eventId, name, email } = parsed.data;

  // Verify event capacity
  const event = await prisma.event.findUnique({
    where: { id: eventId, published: true },
  });

  if (!event) {
    return { errors: { _form: ["Event not found or not published."] } };
  }

  if (event.capacity - event.ticketsSold <= 0) {
    return { errors: { _form: ["Sorry, this event is sold out."] } };
  }

  // Create Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              images: event.image ? [event.image] : [],
            },
            unit_amount: event.price === 0 ? 0 : Math.round(event.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/${event.id}`,
      metadata: {
        eventId: event.id,
        customerName: name,
        customerEmail: email,
      },
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe session URL");
    }

    redirect(session.url);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Let Next.js handle the redirect
    }
    console.error("Stripe error:", error);
    return { errors: { _form: ["An error occurred while communicating with the payment gateway."] } };
  }
}
