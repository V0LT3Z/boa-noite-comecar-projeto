
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const MarketplaceFilters = () => {
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Localização</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Todas as cidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as cidades</SelectItem>
            <SelectItem value="sp">São Paulo</SelectItem>
            <SelectItem value="rj">Rio de Janeiro</SelectItem>
            <SelectItem value="bh">Belo Horizonte</SelectItem>
            <SelectItem value="ba">Salvador</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Categoria</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="show">Shows</SelectItem>
            <SelectItem value="party">Festas</SelectItem>
            <SelectItem value="festival">Festivais</SelectItem>
            <SelectItem value="theater">Teatro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <Label>Faixa de preço</Label>
          <span className="text-sm text-muted-foreground">
            R$ {priceRange[0]} - R$ {priceRange[1]}
          </span>
        </div>
        
        <Slider
          defaultValue={[0, 500]}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={handlePriceChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de ingresso</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="pista">Pista</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="camarote">Camarote</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="pt-4 flex gap-2">
        <Button variant="outline" className="flex-1">Limpar</Button>
        <Button className="flex-1">Aplicar</Button>
      </div>
    </div>
  );
};

export default MarketplaceFilters;
