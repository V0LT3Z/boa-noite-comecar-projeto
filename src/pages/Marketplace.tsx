
import { useState } from "react";
import { Filter, Search, Tag, Ticket } from "lucide-react";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import MarketplaceTicketCard from "@/components/marketplace/MarketplaceTicketCard";
import SellTicketForm from "@/components/marketplace/SellTicketForm";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import { useAuth } from "@/contexts/AuthContext";

const Marketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Mock data for categories and tickets
  const categories = [
    { id: "all", name: "Todos" },
    { id: "show", name: "Shows" },
    { id: "party", name: "Festas" },
    { id: "festival", name: "Festivais" },
    { id: "theater", name: "Teatro" },
  ];

  const tickets = [
    {
      id: 1,
      eventId: 101,
      eventName: "Deu Baile | Sexta",
      eventImage: "/placeholder.svg",
      location: "Pacco Club",
      date: "24.05",
      ticketType: "Pista",
      originalPrice: 75.0,
      price: 75.0,
      seller: "João Silva",
      quantity: 2,
      category: "party"
    },
    {
      id: 2,
      eventId: 102,
      eventName: "Festival de Verão",
      eventImage: "/placeholder.svg",
      location: "Praia de Copacabana",
      date: "15.06",
      ticketType: "VIP",
      originalPrice: 150.0,
      price: 150.0,
      seller: "Maria Santos",
      quantity: 1,
      category: "festival"
    },
    {
      id: 3,
      eventId: 103,
      eventName: "Metallica Tour",
      eventImage: "/placeholder.svg",
      location: "Estádio Nacional",
      date: "30.07",
      ticketType: "Pista Premium",
      originalPrice: 350.0,
      price: 350.0,
      seller: "Pedro Alves",
      quantity: 3,
      category: "show"
    },
  ];

  const filteredTickets = tickets
    .filter(ticket => 
      (selectedCategory === "all" || ticket.category === selectedCategory) &&
      (searchQuery === "" || 
        ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container px-4 pt-6 pb-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Marketplace</h1>
          <p className="text-muted-foreground">
            Compre e venda ingressos de eventos de forma segura
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Buscar eventos, locais..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button 
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full gap-1">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <MarketplaceFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-4 mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <Ticket className="h-4 w-4" />
                Vender ingresso
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Vender ingresso</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <SellTicketForm />
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="outline" className="gap-2">
            <Tag className="h-4 w-4" />
            Meus anúncios
          </Button>
        </div>
        
        {/* Ticket list */}
        <div className="space-y-4">
          {filteredTickets.length === 0 ? (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">Nenhum ingresso encontrado</h3>
              <p className="text-muted-foreground">
                Tente modificar seus filtros ou buscar outro termo
              </p>
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <MarketplaceTicketCard key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
