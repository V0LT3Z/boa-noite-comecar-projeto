
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TicketType {
  id: string;
  name: string;
  price: string;
  description: string;
  availableQuantity: string;
  maxPerPurchase: string;
}

interface EventFormProps {
  event?: any; // Replace with proper type when connected to backend
  onSuccess?: () => void;
}

export const EventForm = ({ event, onSuccess }: EventFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    venue: "",
    bannerUrl: "",
    minimumAge: "0",
    status: "active", // active, paused, cancelled
  });

  const [warnings, setWarnings] = useState<string[]>([""]);
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: Date.now().toString(),
      name: "",
      price: "",
      description: "",
      availableQuantity: "",
      maxPerPurchase: "4",
    },
  ]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Initialize form if editing an event
  useEffect(() => {
    if (event) {
      setEventData({
        title: event.title || "",
        date: event.date || "",
        time: event.time || "",
        location: event.location || "",
        description: event.description || "",
        venue: event.venue || "",
        bannerUrl: event.bannerUrl || "",
        minimumAge: event.minimumAge || "0",
        status: event.status || "active",
      });

      if (event.date) {
        setSelectedDate(new Date(event.date));
      }

      if (event.warnings && event.warnings.length > 0) {
        setWarnings(event.warnings);
      }

      if (event.tickets && event.tickets.length > 0) {
        setTickets(event.tickets);
      }

      if (event.bannerUrl) {
        setPreviewImage(event.bannerUrl);
      }
    }
  }, [event]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setEventData({ ...eventData, bannerUrl: file.name });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setEventData({
      ...eventData,
      date: date ? format(date, 'yyyy-MM-dd') : '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleWarningChange = (index: number, value: string) => {
    const updatedWarnings = [...warnings];
    updatedWarnings[index] = value;
    setWarnings(updatedWarnings);
  };

  const addWarning = () => {
    setWarnings([...warnings, ""]);
  };

  const removeWarning = (index: number) => {
    if (warnings.length > 1) {
      const updatedWarnings = warnings.filter((_, i) => i !== index);
      setWarnings(updatedWarnings);
    }
  };

  const handleTicketChange = (index: number, field: keyof TicketType, value: string) => {
    const updatedTickets = [...tickets];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setTickets(updatedTickets);
  };

  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        id: Date.now().toString(),
        name: "",
        price: "",
        description: "",
        availableQuantity: "",
        maxPerPurchase: "4",
      },
    ]);
  };

  const removeTicket = (index: number) => {
    if (tickets.length > 1) {
      const updatedTickets = tickets.filter((_, i) => i !== index);
      setTickets(updatedTickets);
    }
  };

  const handleSaveDraft = () => {
    // Save as draft logic
    console.log({
      ...eventData,
      status: "draft",
      warnings: warnings.filter(w => w.trim() !== ""),
      tickets: tickets.map(ticket => ({
        ...ticket,
        price: parseFloat(ticket.price) || 0,
        availableQuantity: parseInt(ticket.availableQuantity) || 0,
        maxPerPurchase: parseInt(ticket.maxPerPurchase) || 4
      }))
    });

    toast({
      title: "Rascunho salvo",
      description: "O evento foi salvo como rascunho",
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'date', 'time', 'location', 'venue'];
    const missingFields = requiredFields.filter(field => !eventData[field as keyof typeof eventData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    // Validate tickets
    const invalidTickets = tickets.filter(
      ticket => !ticket.name || !ticket.price || !ticket.availableQuantity
    );
    
    if (invalidTickets.length > 0) {
      toast({
        title: "Ingressos inválidos",
        description: "Preencha nome, preço e quantidade disponível para todos os ingressos",
        variant: "destructive",
      });
      setActiveTab("tickets");
      return;
    }
    
    // Submit form data
    console.log({
      ...eventData,
      warnings: warnings.filter(w => w.trim() !== ""),
      tickets: tickets.map(ticket => ({
        ...ticket,
        price: parseFloat(ticket.price) || 0,
        availableQuantity: parseInt(ticket.availableQuantity) || 0,
        maxPerPurchase: parseInt(ticket.maxPerPurchase) || 4
      }))
    });
    
    toast({
      title: event ? "Evento atualizado" : "Evento criado",
      description: event 
        ? "O evento foi atualizado com sucesso" 
        : "O evento foi criado com sucesso",
    });
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
          <TabsTrigger value="warnings">Avisos e Restrições</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-6 pt-4">
          {/* Banner Upload */}
          <div className="space-y-2">
            <Label htmlFor="banner">Banner do Evento</Label>
            <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
              {previewImage ? (
                <div className="relative w-full max-h-60 mb-4">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="w-full max-h-60 object-cover rounded-lg" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setPreviewImage(null);
                      setEventData({ ...eventData, bannerUrl: "" });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center py-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para fazer upload</span> ou arraste e solte</p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                  </div>
                  <Input
                    id="banner"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </>
              )}
              <label htmlFor="banner" className="cursor-pointer mt-2">
                <Button type="button" variant="outline" className="mt-2">
                  Escolher imagem
                </Button>
              </label>
            </div>
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="title">Nome do Evento *</Label>
              <Input
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={eventData.time}
                  onChange={handleInputChange}
                  className="mt-1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimumAge">Idade Mínima</Label>
                <Input
                  id="minimumAge"
                  name="minimumAge"
                  type="number"
                  min="0"
                  value={eventData.minimumAge}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Localização (Cidade/Estado) *</Label>
                <Input
                  id="location"
                  name="location"
                  value={eventData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo, SP"
                  className="mt-1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="venue">Local do Evento *</Label>
                <Input
                  id="venue"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleInputChange}
                  placeholder="Ex: Estádio do Morumbi"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Evento</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="warnings" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Avisos e Restrições</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addWarning}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Aviso
              </Button>
            </div>

            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={warning}
                    onChange={(e) => handleWarningChange(index, e.target.value)}
                    placeholder="Ex: Evento para maiores de 18 anos"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeWarning(index)}
                    disabled={warnings.length <= 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="pt-4 text-sm text-muted-foreground">
              <p>Adicione avisos importantes sobre o evento, como restrições de idade, regras especiais, informações sobre estacionamento, etc.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Ingressos</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addTicket}
              >
                <Plus className="h-4 w-4 mr-1" /> Adicionar Ingresso
              </Button>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket, index) => (
                <Card key={ticket.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`ticket-name-${index}`}>Nome do Ingresso *</Label>
                        <Input
                          id={`ticket-name-${index}`}
                          value={ticket.name}
                          onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                          placeholder="Ex: VIP, Pista, Camarote"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticket-price-${index}`}>Preço (R$) *</Label>
                        <Input
                          id={`ticket-price-${index}`}
                          value={ticket.price}
                          onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                          placeholder="Ex: 150.00"
                          className="mt-1"
                          type="number"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor={`ticket-description-${index}`}>Descrição</Label>
                      <Input
                        id={`ticket-description-${index}`}
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                        placeholder="Ex: Acesso à área VIP com open bar"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor={`ticket-quantity-${index}`}>Quantidade Disponível *</Label>
                        <Input
                          id={`ticket-quantity-${index}`}
                          value={ticket.availableQuantity}
                          onChange={(e) => handleTicketChange(index, 'availableQuantity', e.target.value)}
                          type="number"
                          min="1"
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`ticket-max-${index}`}>Máximo por Compra *</Label>
                        <Input
                          id={`ticket-max-${index}`}
                          value={ticket.maxPerPurchase}
                          onChange={(e) => handleTicketChange(index, 'maxPerPurchase', e.target.value)}
                          type="number"
                          min="1"
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>

                    {tickets.length > 1 && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeTicket(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remover Ingresso
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline"
          onClick={handleSaveDraft}
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Rascunho
        </Button>
        <Button 
          type="button"
          onClick={handleSubmit}
        >
          {event ? "Atualizar Evento" : "Criar Evento"}
        </Button>
      </div>
    </div>
  );
};
