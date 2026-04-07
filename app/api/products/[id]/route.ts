import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", user.email)
    .single()

  if (!adminCheck) {
    return NextResponse.json({ error: "Accesso negato" }, { status: 403 })
  }

  const body = await request.json()
  
  const { data, error } = await supabase
    .from("products")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", parseInt(id))
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 })
  }

  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", user.email)
    .single()

  if (!adminCheck) {
    return NextResponse.json({ error: "Accesso negato" }, { status: 403 })
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", parseInt(id))

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
