
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="border-b border-white/10 bg-background/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Ticket Hub
        </div>
        <Button className="bg-white/10 hover:bg-white/20 text-white border-white/10">
          <LogIn className="mr-2 h-4 w-4" />
          Login / Cadastro
        </Button>
      </div>
    </header>
  )
}

export default Header

