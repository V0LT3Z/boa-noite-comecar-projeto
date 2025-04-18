
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">Ticket Hub</div>
        <Button>
          <LogIn className="mr-2 h-4 w-4" />
          Login / Cadastro
        </Button>
      </div>
    </header>
  )
}

export default Header
