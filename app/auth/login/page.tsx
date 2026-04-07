"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError("Email o password non validi")
      setIsLoading(false)
      return
    }

    // Check if admin
    const res = await fetch("/api/admin/check")
    const data = await res.json()

    if (data.isAdmin) {
      router.push("/admin")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#ff6b35] mb-6">
          <ArrowLeft className="w-5 h-5" />
          Torna allo shop
        </Link>

        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🛒</div>
          <h1 className="text-2xl font-bold text-gray-800">Accedi</h1>
          <p className="text-gray-500 mt-1">Bentornato su Palia Punjabi Market</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="esempio@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="La tua password"
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#ff6b35] text-white font-bold rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Accesso in corso..." : "Accedi"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Non hai un account?{" "}
          <Link href="/auth/sign-up" className="text-[#ff6b35] hover:underline font-medium">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  )
}
