import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Aramkore@##$54545";

export async function GET() {
  const { data } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "giveaway_status")
    .single();

  return Response.json(data?.value || { active: true });
}

export async function POST(request) {
  try {
    const { active, password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("settings")
      .upsert({ key: "giveaway_status", value: { active } });

    if (error) throw error;

    return Response.json({ success: true, active });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
