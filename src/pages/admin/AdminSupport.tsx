
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Support message interface
interface SupportMessage {
  id: string;
  eventName: string;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
  status: "open" | "in-progress" | "closed";
  date: string;
  conversation: {
    sender: "user" | "admin";
    message: string;
    timestamp: string;
  }[];
}

// Mock data for demonstration
const mockMessages: SupportMessage[] = [
  {
    id: "1",
    eventName: "Festival de Verão 2025",
    subject: "Problema com ingresso",
    message: "Olá, comprei um ingresso mas não consigo acessar o QR Code. Podem me ajudar?",
    userName: "Ana Silva",
    userEmail: "ana@exemplo.com",
    status: "open",
    date: "2025-02-01T14:30:00",
    conversation: [
      {
        sender: "user",
        message: "Olá, comprei um ingresso mas não consigo acessar o QR Code. Podem me ajudar?",
        timestamp: "2025-02-01T14:30:00",
      },
    ],
  },
  {
    id: "2",
    eventName: "Festival de Verão 2025",
    subject: "Dúvida sobre estacionamento",
    message: "Bom dia, gostaria de saber se há estacionamento disponível no local do evento.",
    userName: "Carlos Santos",
    userEmail: "carlos@exemplo.com",
    status: "in-progress",
    date: "2025-02-02T10:15:00",
    conversation: [
      {
        sender: "user",
        message: "Bom dia, gostaria de saber se há estacionamento disponível no local do evento.",
        timestamp: "2025-02-02T10:15:00",
      },
      {
        sender: "admin",
        message: "Olá Carlos, o evento terá estacionamento disponível por R$ 30,00. O pagamento pode ser feito no local. Precisa de mais alguma informação?",
        timestamp: "2025-02-02T11:30:00",
      },
    ],
  },
  {
    id: "3",
    eventName: "Show de Rock",
    subject: "Cancelamento",
    message: "Preciso cancelar meu ingresso, como faço?",
    userName: "Márcia Oliveira",
    userEmail: "marcia@exemplo.com",
    status: "closed",
    date: "2025-01-25T16:45:00",
    conversation: [
      {
        sender: "user",
        message: "Preciso cancelar meu ingresso, como faço?",
        timestamp: "2025-01-25T16:45:00",
      },
      {
        sender: "admin",
        message: "Olá Márcia, para cancelar seu ingresso você pode acessar a seção 'Meus Ingressos' no site e clicar em 'Solicitar Reembolso'. O valor será estornado em até 7 dias úteis.",
        timestamp: "2025-01-25T17:20:00",
      },
      {
        sender: "user",
        message: "Encontrei a opção, obrigada!",
        timestamp: "2025-01-25T17:35:00",
      },
      {
        sender: "admin",
        message: "Estamos à disposição para mais esclarecimentos. Tenha um bom dia!",
        timestamp: "2025-01-25T17:40:00",
      },
    ],
  },
];

const AdminSupport = () => {
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter messages based on search query and active tab
  const filteredMessages = supportMessages
    .filter(message => 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(message => {
      if (activeTab === "all") return true;
      return message.status === activeTab;
    });

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle sending a reply
  const handleSendReply = () => {
    if (!selectedMessage || !replyText.trim()) return;

    // Update the conversation with the new reply
    const updatedMessage: SupportMessage = {
      ...selectedMessage,
      status: "in-progress",
      conversation: [
        ...selectedMessage.conversation,
        {
          sender: "admin",
          message: replyText,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Update messages list
    setSupportMessages(
      supportMessages.map(message => 
        message.id === selectedMessage.id ? updatedMessage : message
      )
    );

    // Update selected message
    setSelectedMessage(updatedMessage);
    
    // Clear reply text
    setReplyText("");
    
    toast({
      title: "Resposta enviada",
      description: "Sua resposta foi enviada com sucesso.",
      variant: "default",
    });
  };

  // Handle closing a support ticket
  const handleCloseTicket = () => {
    if (!selectedMessage) return;

    // Update the status to closed
    const updatedMessage: SupportMessage = {
      ...selectedMessage,
      status: "closed",
    };

    // Update messages list
    setSupportMessages(
      supportMessages.map(message => 
        message.id === selectedMessage.id ? updatedMessage : message
      )
    );

    // Update selected message
    setSelectedMessage(updatedMessage);
    
    toast({
      title: "Chamado encerrado",
      description: "O chamado foi encerrado com sucesso.",
      variant: "default",
    });
  };

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Aberto</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Em atendimento</Badge>;
      case "closed":
        return <Badge variant="outline" className="text-muted-foreground">Encerrado</Badge>;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Suporte</h1>
          <p className="text-muted-foreground">
            Gerencie os chamados de suporte dos participantes dos seus eventos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar chamados..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                <TabsTrigger value="open" className="flex-1">Abertos</TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-1">Em atendimento</TabsTrigger>
                <TabsTrigger value="closed" className="flex-1">Encerrados</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="border rounded-md max-h-[600px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assunto</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-6 text-muted-foreground">
                        Nenhum chamado encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => (
                      <TableRow 
                        key={message.id}
                        className={`cursor-pointer ${selectedMessage?.id === message.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <TableCell>
                          <div className="font-medium">{message.subject}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {message.userName} • {formatDate(message.date)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{selectedMessage.subject}</CardTitle>
                    <CardDescription className="pt-1">
                      {selectedMessage.eventName} • {formatDate(selectedMessage.date)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedMessage.status)}
                    {selectedMessage.status !== "closed" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCloseTicket}
                      >
                        Encerrar chamado
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="mb-4">
                    <h4 className="font-medium text-sm">Dados do usuário</h4>
                    <div className="text-sm grid grid-cols-2 gap-x-2 gap-y-1 mt-1">
                      <span className="text-muted-foreground">Nome:</span>
                      <span>{selectedMessage.userName}</span>
                      <span className="text-muted-foreground">E-mail:</span>
                      <span>{selectedMessage.userEmail}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-3 flex-1 overflow-y-auto space-y-4 bg-muted/30 mb-4">
                    {selectedMessage.conversation.map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex flex-col ${
                          item.sender === 'admin' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div 
                          className={`rounded-lg p-3 max-w-[80%] ${
                            item.sender === 'admin' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card border'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.timestamp)} • {item.sender === 'admin' ? 'Você' : selectedMessage.userName}
                        </span>
                      </div>
                    ))}
                  </div>

                  {selectedMessage.status !== "closed" && (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Digite sua resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                      />
                      <Button onClick={handleSendReply} className="w-full">
                        Enviar resposta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center text-center p-6">
                <div className="max-w-sm">
                  <h3 className="text-lg font-medium">Nenhum chamado selecionado</h3>
                  <p className="text-muted-foreground mt-2">
                    Selecione um chamado da lista para visualizar e responder.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
