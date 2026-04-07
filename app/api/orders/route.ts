import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function GET() {
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

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  const orderId = `ORD-${nanoid(8).toUpperCase()}`
  
  const { data, error } = await supabase
    .from("orders")
    .insert([{
      id: orderId,
      user_id: user?.id ?? null,
      customer_name: body.customer_name,
      customer_surname: body.customer_surname,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      address: body.address,
      city: body.city,
      cap: body.cap,
      delivery_type: body.delivery_type,
      delivery_price: body.delivery_price || 0,
      items: body.items,
      total: body.total,
      status: 'preparazione'
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Keep authenticated user's profile in sync with checkout details.
  if (user) {
    await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        name: body.customer_name || null,
        surname: body.customer_surname || null,
        phone: body.customer_phone || null,
        address: body.address || null,
        city: body.city || null,
        cap: body.cap || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
  }

  return NextResponse.json(data)
}
