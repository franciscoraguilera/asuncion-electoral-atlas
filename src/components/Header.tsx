
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectionYear } from "@/types";
import { ArrowDown } from "lucide-react";  // Changed from ArrowDownload to ArrowDown

interface HeaderProps {
  title: string;
  subtitle: string;
  selectedYear: number;
  electionYears: ElectionYear[];
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  selectedYear,
  electionYears,
  onYearChange,
}) => {
  return (
    <div className="w-full mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <ArrowDown className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="mb-4 border-b">
        <Tabs
          defaultValue={selectedYear.toString()}
          onValueChange={(value) => onYearChange(Number(value))}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full md:w-96">
            {electionYears.map((year) => (
              <TabsTrigger key={year.value} value={year.value.toString()}>
                {year.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default Header;
