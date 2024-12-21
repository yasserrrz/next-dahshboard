"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 *
 * https://chatgpt.com/share/675de129-285c-8007-b5b8-33eaa2f32d7e
 */

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  // Convert amount from string to number and validate it
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
  date: z.string(),
});

// To remove certain keys, use .omit
const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  await sql`
   INSERT INTO invoices (customer_id, amount, status, date) 
   VALUES  (${customerId} , ${amountInCents} , ${status} , ${date}) 
  `;
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
