import { Header } from "@/components/header"
import { RegistrationForm } from "@/components/registration-form"

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <RegistrationForm />
      </main>
    </div>
  )
}
