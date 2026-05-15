import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // service role for server-side writes
);

const MAX_NUMBER = 1000;

export async function POST(request) {
  try {
    const { username } = await request.json();

    // Get IP Address from headers (works on Vercel and most proxies)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

    // Basic validation
    const clean = username.trim().replace(/^@/, "").toLowerCase();
    if (!clean) {
      return Response.json({ error: "Username is required." }, { status: 400 });
    }
    if (!/^[a-z0-9._]+$/.test(clean)) {
      return Response.json(
        { error: "Invalid Instagram username." },
        { status: 400 }
      );
    }

    // 1. Check if IP already entered (to prevent cheating)
    const { data: ipCheck } = await supabase
      .from("entries")
      .select("username, lucky_number")
      .eq("ip_address", ip)
      .single();

    if (ipCheck) {
      return Response.json(
        {
          error: "You have already entered from this device/IP!",
          lucky_number: ipCheck.lucky_number,
          already_entered: true,
          username: ipCheck.username
        },
        { status: 403 }
      );
    }

    // 2. Check if username already entered
    const { data: existing } = await supabase
      .from("entries")
      .select("lucky_number")
      .eq("username", clean)
      .single();

    if (existing) {
      return Response.json(
        {
          error: `@${clean} already entered! Your number is #${existing.lucky_number}.`,
          lucky_number: existing.lucky_number,
          already_entered: true,
        },
        { status: 409 }
      );
    }

    // Fetch all taken numbers
    const { data: takenRows } = await supabase
      .from("entries")
      .select("lucky_number");

    const taken = new Set((takenRows || []).map((r) => r.lucky_number));

    if (taken.size >= MAX_NUMBER) {
      return Response.json(
        { error: "All 1000 numbers are taken! Giveaway is full." },
        { status: 410 }
      );
    }

    // Pick a random unused number
    let lucky;
    let tries = 0;
    do {
      lucky = Math.floor(Math.random() * MAX_NUMBER) + 1;
      tries++;
    } while (taken.has(lucky) && tries < 5000);

    // Insert entry
    const { error: insertError } = await supabase.from("entries").insert({
      username: clean,
      lucky_number: lucky,
      ip_address: ip
    });

    if (insertError) {
      // Could be a race-condition duplicate — handle gracefully
      if (insertError.code === "23505") {
        return Response.json(
          { error: "You have already entered the giveaway!" },
          { status: 409 }
        );
      }
      throw insertError;
    }

    return Response.json({ lucky_number: lucky, username: clean });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
