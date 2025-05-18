
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function CleanupAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { clearAuthCache, removeUserByEmail } = useAuth();
  const [email, setEmail] = useState("");

  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      await clearAuthCache();
      toast({
        title: "Cache de autenticação limpo",
        description: "Todos os dados de login foram removidos da sua navegação local.",
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao limpar cache:", error);
      toast({
        title: "Erro ao limpar cache",
        description: "Não foi possível limpar todos os dados de navegação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAccount = async () => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Por favor, informe o email da conta que deseja remover.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await removeUserByEmail(email);
      if (success) {
        toast({
          title: "Conta removida com sucesso",
          description: `A conta ${email} foi completamente removida do sistema.`,
          variant: "success",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Erro ao remover conta:", error);
      toast({
        title: "Erro ao remover conta",
        description: "Não foi possível remover a conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Ferramentas de Teste de Autenticação</h2>
      
      <div>
        <Button 
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleClearCache}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
          Limpar Cache de Autenticação Local
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          Limpa apenas os dados armazenados neste navegador, sem afetar o servidor.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Remover Conta do Servidor</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email da conta"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Button 
            variant="destructive"
            onClick={handleRemoveAccount}
            disabled={isLoading || !email}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
            Remover
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Remove completamente a conta do sistema, permitindo que o email seja cadastrado novamente.
        </p>
      </div>
    </div>
  );
}
