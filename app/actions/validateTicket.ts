"use server";

import { prisma } from "@/lib/prisma";

export type ValidationResult = 
  | { status: "INVALID"; message: string }
  | { 
      status: "USED"; 
      message: string;
      ticketCode: string;
      customerName: string;
      eventName: string;
    }
  | { 
      status: "VALID"; 
      message: string;
      ticketCode: string;
      customerName: string;
      eventName: string;
    };

export async function validateTicket(ticketCode: string): Promise<ValidationResult> {
  if (!ticketCode || ticketCode.trim() === "") {
    return { status: "INVALID", message: "Ticket code is empty." };
  }

  // Clean the ticket code (remove whitespace, uppercase)
  const cleanCode = ticketCode.trim().toUpperCase();

  const ticket = await prisma.ticket.findUnique({
    where: { ticketCode: cleanCode },
    include: { event: true },
  });

  if (!ticket) {
    return { status: "INVALID", message: `Ticket ${cleanCode} not found.` };
  }

  if (ticket.isUsed) {
    return {
      status: "USED",
      message: "Ticket has already been scanned.",
      ticketCode: ticket.ticketCode,
      customerName: ticket.customerName,
      eventName: ticket.event.title,
    };
  }

  // Mark ticket as used
  await prisma.ticket.update({
    where: { id: ticket.id },
    data: { isUsed: true },
  });

  return {
    status: "VALID",
    message: "Ticket is valid. Access granted.",
    ticketCode: ticket.ticketCode,
    customerName: ticket.customerName,
    eventName: ticket.event.title,
  };
}
