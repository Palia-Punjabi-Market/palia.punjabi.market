import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ isAdmin: false })
  }

  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", user.email)
    .single()

  return NextResponse.json({ 
    isAdmin: !!adminCheck,
    email: user.email 
  })
}
