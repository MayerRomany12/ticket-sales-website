import { NextResponse } from "next/response";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import Stripe from "stripe";
import { Resend } from "resend";
import { TicketEmail } from "@/components/emails/TicketEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateTicketCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "TV-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Missing stripe signature or webhook secret");
    }
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fulfill the purchase...
    const { eventId, customerName, customerEmail } = session.metadata || {};

    if (!eventId || !customerName || !customerEmail) {
      console.error("Missing metadata in session:", session.id);
      return new NextResponse("Missing metadata", { status: 400 });
    }

    try {
      // 1. Generate unique ticket code
      const ticketCode = generateTicketCode();

      // 2. Generate QR code (Data URI format)
      const qrCode = await QRCode.toDataURL(ticketCode, {
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
        margin: 2,
        width: 300,
      });

      // 3. Create Ticket record & Update Event capacity in a transaction
      await prisma.$transaction(async (tx) => {
        // Verify capacity one last time to be completely safe
        const dbEvent = await tx.event.findUnique({ where: { id: eventId } });
        if (!dbEvent) throw new Error("Event not found");

        if (dbEvent.ticketsSold >= dbEvent.capacity) {
          // In a real app, we would refund the user here.
          console.error("Event sold out during fulfillment!");
        }

        await tx.ticket.create({
          data: {
            ticketCode,
            stripeSessionId: session.id,
            customerName,
            customerEmail,
            qrCode,
            eventId,
          },
        });

        await tx.event.update({
          where: { id: eventId },
          data: {
            ticketsSold: { increment: 1 },
          },
        });
      });

      console.log(`Ticket ${ticketCode} created for ${customerEmail}`);

      // 4. Send Confirmation Email
      const eventDetails = await prisma.event.findUnique({ where: { id: eventId } });
      if (eventDetails) {
        const formattedDate = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(eventDetails.date));

        await resend.emails.send({
          from: "TicketVault <onboarding@resend.dev>",
          to: customerEmail,
          subject: `Your Ticket for ${eventDetails.title}`,
          react: TicketEmail({
            customerName: customerName as string,
            eventName: eventDetails.title,
            eventDate: formattedDate,
            eventLocation: eventDetails.location,
            ticketCode,
            qrCodeUrl: qrCode,
          }),
        });
        console.log(`Email sent to ${customerEmail}`);
      }
    } catch (err: any) {
      console.error("Fulfillment failed:", err);
      return new NextResponse("Fulfillment Error", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
