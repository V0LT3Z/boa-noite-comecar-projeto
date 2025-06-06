
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { User, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import FormattedInput from "@/components/FormattedInput";
import { useProtectedRoute } from "@/hooks/use-protected-route";
import Header from "@/components/Header";

const EditProfile = () => {
  const { isLoading } = useProtectedRoute();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao@example.com",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00",
    birthdate: "15/05/1990",
    password: "••••••••",
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 42",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    }
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as Record<string, string>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
      variant: "success"
    });
    
    setIsSaving(false);
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Link to="/minha-conta" className="inline-block mb-6">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-primary mb-8 flex items-center gap-2">
            <User />
            Editar Perfil
          </h1>
          
          <form onSubmit={handleSubmit}>
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Informações Pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Nome completo
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      E-mail
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para alterar seu email, contate o suporte.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Telefone
                    </label>
                    <FormattedInput
                      value={formData.phone}
                      onChange={(value) => handleInputChange('phone', value)}
                      format={formatPhone}
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      CPF
                    </label>
                    <FormattedInput
                      value={formData.cpf}
                      onChange={(value) => handleInputChange('cpf', value)}
                      format={formatCPF}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Data de Nascimento
                    </label>
                    <FormattedInput
                      value={formData.birthdate}
                      onChange={(value) => handleInputChange('birthdate', value)}
                      format={formatDate}
                      placeholder="DD/MM/AAAA"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Senha
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Deixe em branco para manter a senha atual.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  Endereço
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Rua/Avenida
                    </label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Número
                    </label>
                    <Input
                      value={formData.address.number}
                      onChange={(e) => handleInputChange('address.number', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Complemento
                    </label>
                    <Input
                      value={formData.address.complement}
                      onChange={(e) => handleInputChange('address.complement', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Bairro
                    </label>
                    <Input
                      value={formData.address.neighborhood}
                      onChange={(e) => handleInputChange('address.neighborhood', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      CEP
                    </label>
                    <FormattedInput
                      value={formData.address.zipCode}
                      onChange={(value) => handleInputChange('address.zipCode', value)}
                      format={formatZipCode}
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Cidade
                    </label>
                    <Input
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Estado
                    </label>
                    <Input
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      maxLength={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6">
              <Button 
                type="submit" 
                disabled={isSaving}
                className="bg-gradient-primary hover:opacity-90 flex gap-2"
              >
                {isSaving ? "Salvando..." : "Salvar alterações"}
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

// Format functions that were previously defined at the top of the file
const formatCPF = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const formatDate = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
};

const formatZipCode = (value: string) => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

export default EditProfile;
