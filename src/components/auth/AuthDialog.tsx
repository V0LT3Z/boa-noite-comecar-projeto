
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "./LoginForm"
import RegisterForm from "./RegisterForm"
import ForgotPasswordForm from "./ForgotPasswordForm"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot-password">("login")

  const handleSuccess = () => {
    onSuccess();
    onOpenChange(false); // Close the dialog on success
  };

  const handleForgotPassword = () => {
    setActiveTab("forgot-password");
  };

  const handleBackToLogin = () => {
    setActiveTab("login");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto font-gooddog">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary text-center font-gooddog">
            {activeTab === "login" && "Entrar na sua conta"}
            {activeTab === "register" && "Criar sua conta"}
            {activeTab === "forgot-password" && "Recuperar senha"}
          </DialogTitle>
          <DialogDescription className="text-center font-gooddog">
            {activeTab === "login" 
              ? "Faça login para continuar com a compra de ingressos" 
              : activeTab === "register"
              ? "Cadastre-se para comprar ingressos para este evento"
              : "Digite seu email para receber instruções de recuperação de senha"}
          </DialogDescription>
        </DialogHeader>

        {activeTab !== "forgot-password" ? (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 font-gooddog">
              <TabsTrigger value="login" className="font-gooddog">Login</TabsTrigger>
              <TabsTrigger value="register" className="font-gooddog">Cadastro</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <LoginForm onSuccess={handleSuccess} onForgotPassword={handleForgotPassword} />
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <RegisterForm onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-4">
            <ForgotPasswordForm onSuccess={handleBackToLogin} onCancel={handleBackToLogin} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
