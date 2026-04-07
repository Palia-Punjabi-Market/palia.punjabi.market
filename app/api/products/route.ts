import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("is_top", { ascending: false })
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
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
    .insert([body])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
