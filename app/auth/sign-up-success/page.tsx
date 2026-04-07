import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ff6b35] to-[#f7931e] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">Controlla la tua email!</h1>
        <p className="text-gray-500 mb-6">
          Ti abbiamo inviato un link di conferma. Clicca sul link nella email per attivare il tuo account.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            Non hai ricevuto la email? Controlla la cartella spam o riprova la registrazione.
          </p>
        </div>

        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-[#ff6b35] hover:underline font-medium"
        >
          Vai al login
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
