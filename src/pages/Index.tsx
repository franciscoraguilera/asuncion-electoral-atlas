
import React, { useState } from "react";
import { electionYears, mockVotingData, parties } from "@/data/mockData";
import Header from "@/components/Header";
import FilterPanel from "@/components/FilterPanel";
import ElectoralMap from "@/components/ElectoralMap";
import StatisticsPanel from "@/components/StatisticsPanel";
import NeighborhoodTable from "@/components/NeighborhoodTable";
import { MapFilters } from "@/types";

const Index = () => {
  const [selectedYear, setSelectedYear] = useState<number>(electionYears[0].value);
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [comparisonYear, setComparisonYear] = useState<number | null>(null);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Reset comparison if the year changes
    if (comparisonYear === year) {
      setComparisonYear(null);
    }
  };

  const handlePartyChange = (party: string | null) => {
    setSelectedParty(party);
  };

  const handleComparisonYearChange = (year: number | null) => {
    setComparisonYear(year);
  };

  const handleReset = () => {
    setSelectedParty(null);
    setComparisonYear(null);
  };

  const mapFilters: MapFilters = {
    year: selectedYear,
    party: selectedParty,
    comparisonYear,
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Header
        title="Atlas Electoral de Asunción"
        subtitle="Visualice los resultados de las elecciones por barrios"
        selectedYear={selectedYear}
        electionYears={electionYears}
        onYearChange={handleYearChange}
      />

      <FilterPanel
        parties={parties}
        electionYears={electionYears}
        selectedParty={selectedParty}
        comparisonYear={comparisonYear}
        currentYear={selectedYear}
        onPartyChange={handlePartyChange}
        onComparisonYearChange={handleComparisonYearChange}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ElectoralMap filters={mapFilters} />
        </div>
        <div className="lg:col-span-1">
          <StatisticsPanel
            votingData={mockVotingData}
            parties={parties}
            selectedYear={selectedYear}
            comparisonYear={comparisonYear}
          />
        </div>
      </div>

      <div className="mb-6">
        <NeighborhoodTable
          votingData={mockVotingData}
          parties={parties}
          selectedYear={selectedYear}
          comparisonYear={comparisonYear}
          selectedParty={selectedParty}
        />
      </div>

      <footer className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>Atlas Electoral de Asunción - Datos electorales por barrio</p>
        <p className="mt-1">© {new Date().getFullYear()} - Sistema de Visualización Electoral</p>
      </footer>
    </div>
  );
};

export default Index;
