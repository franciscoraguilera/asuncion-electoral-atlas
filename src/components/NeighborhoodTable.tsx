
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Party, VotingData } from "@/types";
import { formatNumber, calculatePercentage } from "@/utils/mapUtils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface NeighborhoodTableProps {
  votingData: VotingData[];
  parties: Party[];
  selectedYear: number;
  comparisonYear: number | null;
  selectedParty: string | null;
}

const NeighborhoodTable: React.FC<NeighborhoodTableProps> = ({
  votingData,
  parties,
  selectedYear,
  comparisonYear,
  selectedParty,
}) => {
  const filteredData = votingData.filter((data) => data.year === selectedYear);
  
  // Get comparison data if needed
  const comparisonData = comparisonYear
    ? votingData.filter((data) => data.year === comparisonYear)
    : [];
  
  // Sort by neighborhood name
  const sortedData = [...filteredData].sort((a, b) =>
    a.neighborhood.localeCompare(b.neighborhood)
  );
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Resultados por Barrio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barrio</TableHead>
                <TableHead>Total de votos</TableHead>
                {selectedParty ? (
                  <TableHead>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: parties.find((p) => p.id === selectedParty)?.color || "#ccc",
                        }}
                      ></span>
                      {parties.find((p) => p.id === selectedParty)?.name || "Partido"}
                    </div>
                  </TableHead>
                ) : (
                  parties.map((party) => (
                    <TableHead key={party.id}>
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: party.color }}
                        ></span>
                        {party.name}
                      </div>
                    </TableHead>
                  ))
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((data) => {
                // Find comparison data for this neighborhood
                const comparisonNeighborhood = comparisonData.find(
                  (c) => c.neighborhood === data.neighborhood
                );
                
                return (
                  <TableRow key={data.id}>
                    <TableCell>{data.neighborhood}</TableCell>
                    <TableCell>
                      <div>
                        {formatNumber(data.totalVotes)}
                        {comparisonNeighborhood && (
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            {data.totalVotes > comparisonNeighborhood.totalVotes ? (
                              <span className="flex items-center text-green-600">
                                <ArrowUp className="w-3 h-3 mr-1" />
                                {calculatePercentage(
                                  data.totalVotes - comparisonNeighborhood.totalVotes,
                                  comparisonNeighborhood.totalVotes
                                )}
                              </span>
                            ) : data.totalVotes < comparisonNeighborhood.totalVotes ? (
                              <span className="flex items-center text-red-600">
                                <ArrowDown className="w-3 h-3 mr-1" />
                                {calculatePercentage(
                                  comparisonNeighborhood.totalVotes - data.totalVotes,
                                  comparisonNeighborhood.totalVotes
                                )}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <Minus className="w-3 h-3 mr-1" />
                                0%
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    {selectedParty ? (
                      <TableCell>
                        <div>
                          {formatNumber(data.votes[selectedParty] || 0)}{" "}
                          <span className="text-xs text-muted-foreground">
                            ({calculatePercentage(
                              data.votes[selectedParty] || 0,
                              data.totalVotes
                            )})
                          </span>
                          {comparisonNeighborhood && (
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              {(() => {
                                const currentPerc = (data.votes[selectedParty] || 0) / data.totalVotes;
                                const prevPerc =
                                  (comparisonNeighborhood.votes[selectedParty] || 0) /
                                  comparisonNeighborhood.totalVotes;
                                const diff = (currentPerc - prevPerc) * 100;
                                
                                if (diff > 0.5) {
                                  return (
                                    <span className="flex items-center text-green-600">
                                      <ArrowUp className="w-3 h-3 mr-1" />
                                      {diff.toFixed(1)}pp
                                    </span>
                                  );
                                } else if (diff < -0.5) {
                                  return (
                                    <span className="flex items-center text-red-600">
                                      <ArrowDown className="w-3 h-3 mr-1" />
                                      {Math.abs(diff).toFixed(1)}pp
                                    </span>
                                  );
                                } else {
                                  return (
                                    <span className="flex items-center">
                                      <Minus className="w-3 h-3 mr-1" />
                                      0pp
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    ) : (
                      parties.map((party) => (
                        <TableCell key={party.id}>
                          <div>
                            {formatNumber(data.votes[party.id] || 0)}{" "}
                            <span className="text-xs text-muted-foreground">
                              ({calculatePercentage(
                                data.votes[party.id] || 0,
                                data.totalVotes
                              )})
                            </span>
                            {comparisonNeighborhood && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                {(() => {
                                  const currentPerc = (data.votes[party.id] || 0) / data.totalVotes;
                                  const prevPerc =
                                    (comparisonNeighborhood.votes[party.id] || 0) /
                                    comparisonNeighborhood.totalVotes;
                                  const diff = (currentPerc - prevPerc) * 100;
                                  
                                  if (diff > 0.5) {
                                    return (
                                      <span className="flex items-center text-green-600">
                                        <ArrowUp className="w-3 h-3 mr-1" />
                                        {diff.toFixed(1)}pp
                                      </span>
                                    );
                                  } else if (diff < -0.5) {
                                    return (
                                      <span className="flex items-center text-red-600">
                                        <ArrowDown className="w-3 h-3 mr-1" />
                                        {Math.abs(diff).toFixed(1)}pp
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span className="flex items-center">
                                        <Minus className="w-3 h-3 mr-1" />
                                        0pp
                                      </span>
                                    );
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      ))
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default NeighborhoodTable;
