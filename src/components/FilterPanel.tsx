
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ElectionYear, Party } from "@/types";
import { RotateCw, ChevronDown, ChevronUp, MinusCircle } from "lucide-react";

interface FilterPanelProps {
  parties: Party[];
  electionYears: ElectionYear[];
  selectedParty: string | null;
  comparisonYear: number | null;
  currentYear: number;
  onPartyChange: (partyId: string | null) => void;
  onComparisonYearChange: (year: number | null) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  parties,
  electionYears,
  selectedParty,
  comparisonYear,
  currentYear,
  onPartyChange,
  onComparisonYearChange,
  onReset,
}) => {
  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Filtros</CardTitle>
        <CardDescription>
          Filtra por partido político y compara con años anteriores
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Partido Político
            </label>
            <Select
              value={selectedParty || ""}
              onValueChange={(value) => onPartyChange(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos los partidos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los partidos</SelectItem>
                {parties.map((party) => (
                  <SelectItem key={party.id} value={party.id}>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: party.color }}
                      ></span>
                      {party.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Comparar con el año
            </label>
            <Select
              value={comparisonYear?.toString() || ""}
              onValueChange={(value) => onComparisonYearChange(value ? Number(value) : null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar año para comparar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin comparación</SelectItem>
                {electionYears
                  .filter((year) => year.value !== currentYear)
                  .map((year) => (
                    <SelectItem key={year.value} value={year.value.toString()}>
                      {year.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onReset}
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Reiniciar filtros
            </Button>
          </div>
        </div>

        {selectedParty && (
          <div className="flex items-center p-2 bg-muted rounded-md">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor:
                    parties.find((p) => p.id === selectedParty)?.color || "#ccc",
                }}
              ></div>
              <span className="text-sm font-medium">
                {parties.find((p) => p.id === selectedParty)?.name || "Partido"}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 w-7 p-0"
              onClick={() => onPartyChange(null)}
            >
              <MinusCircle className="h-4 w-4" />
              <span className="sr-only">Remover filtro</span>
            </Button>
          </div>
        )}

        {comparisonYear && (
          <div className="flex items-center p-2 bg-muted rounded-md">
            <div className="flex items-center">
              <span className="text-sm font-medium">
                Comparando con {comparisonYear}
              </span>
              <div className="ml-2 flex items-center space-x-1">
                <span className="text-xs text-green-600 flex items-center">
                  <ChevronUp className="h-3 w-3" />
                  Aumento
                </span>
                <span className="text-xs text-red-600 flex items-center">
                  <ChevronDown className="h-3 w-3" />
                  Disminución
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 w-7 p-0"
              onClick={() => onComparisonYearChange(null)}
            >
              <MinusCircle className="h-4 w-4" />
              <span className="sr-only">Remover comparación</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
