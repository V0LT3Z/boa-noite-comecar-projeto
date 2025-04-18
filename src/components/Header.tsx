
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1" /> {/* Espaçador esquerdo */}
          <div className="text-3xl font-bold text-primary text-center flex-1">
            Ticket Hub
          </div>
          <div className="flex-1 flex justify-end">
            <Button className="bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
