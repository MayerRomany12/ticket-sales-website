"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventSchema, type EventFormState } from "@/lib/validations/event";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  return session;
}

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80) +
    "-" +
    Date.now()
  );
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = EventSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten()
        .fieldErrors as EventFormState["errors"],
    };
  }

  const { date, image, ...rest } = parsed.data;

  try {
    await prisma.event.create({
      data: {
        ...rest,
        slug: generateSlug(rest.title),
        image: image ?? null,
        date: new Date(date),
        published: false,
      },
    });
  } catch {
    return { errors: { _form: ["Failed to create event. Please try again."] } };
  }

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateEvent(
  id: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  await requireAdmin();

  const raw = Object.fromEntries(formData.entries());
  const parsed = EventSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten()
        .fieldErrors as EventFormState["errors"],
    };
  }

  const { date, image, ...rest } = parsed.data;

  try {
    await prisma.event.update({
      where: { id },
      data: {
        ...rest,
        image: image ?? null,
        date: new Date(date),
      },
    });
  } catch {
    return { errors: { _form: ["Failed to update event. Please try again."] } };
  }

  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${id}`);
  redirect("/admin/events");
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteEvent(id: string): Promise<void> {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

// ─── Toggle Publish ───────────────────────────────────────────────────────────
export async function togglePublish(
  id: string,
  published: boolean
): Promise<void> {
  await requireAdmin();
  await prisma.event.update({ where: { id }, data: { published } });
  revalidatePath("/admin/events");
}
