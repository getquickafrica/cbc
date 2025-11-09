import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      user_id,
      username,
      unique_name,
      support_name,
      title,
      description,
      tags,
      revenue = 0,
      views = 0,
      downloads = 0,
    } = body;

    const { error } = await supabase.from("materials").insert([
      {
        user_id,
        username,
        unique_name,
        support_material_name: support_name,
        title,
        description,
        tags,
        revenue,
        views,
        downloads,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
