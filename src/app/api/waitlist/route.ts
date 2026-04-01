import { getSupabase } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!name) {
      return Response.json({ error: "Please enter your name." }, { status: 400 });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("waitlist").insert({ name, email });

    // Postgres unique violation on email — return success anyway.
    // Never reveal whether an email is already on the list.
    if (error && error.code !== "23505") {
      console.error("[waitlist] insert error:", error.message);
      return Response.json({ error: "Something went wrong." }, { status: 500 });
    }

    // Send confirmation only for new signups (not duplicate emails)
    if (!error) {
      try {
        await sendWaitlistConfirmation(name, email);
      } catch (emailError) {
        // Log but don't fail the signup — DB row is already written
        console.error("[waitlist] email error:", emailError);
      }
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
