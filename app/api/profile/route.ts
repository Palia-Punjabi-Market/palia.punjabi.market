import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ profile: null })
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error) {
    return NextResponse.json({ profile: null })
  }

  return NextResponse.json({ profile: data })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const body = await request.json()
  const payload = {
    id: user.id,
    name: body.name || null,
    surname: body.surname || null,
    phone: body.phone || null,
    address: body.address || null,
    city: body.city || null,
    cap: body.cap || null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ profile: data })
}
