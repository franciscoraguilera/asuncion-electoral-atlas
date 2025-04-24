
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Party, VotingData } from "@/types";
import { formatNumber, calculatePercentage, getVotingTrend } from "@/utils/mapUtils";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface StatisticsPanelProps {
  votingData: VotingData[];
  parties: Party[];
  selectedYear: number;
  comparisonYear: number | null;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  votingData,
  parties,
  selectedYear,
  comparisonYear,
}) => {
  // Filter data for selected year
  const currentYearData = votingData.filter(
    (data) => data.year === selectedYear
  );

  // Calculate totals for selected year
  const totalsByParty: { [key: string]: number } = {};
  let totalVotes = 0;

  currentYearData.forEach((data) => {
    Object.entries(data.votes).forEach(([party, votes]) => {
      totalsByParty[party] = (totalsByParty[party] || 0) + votes;
    });
    totalVotes += data.totalVotes;
  });

  // Get previous year data for comparison
  const comparisonYearData = comparisonYear
    ? votingData.filter((data) => data.year === comparisonYear)
    : null;

  // Calculate totals for comparison year if available
  const comparisonTotalsByParty: { [key: string]: number } = {};
  let comparisonTotalVotes = 0;

  if (comparisonYearData) {
    comparisonYearData.forEach((data) => {
      Object.entries(data.votes).forEach(([party, votes]) => {
        comparisonTotalsByParty[party] = (comparisonTotalsByParty[party] || 0) + votes;
      });
      comparisonTotalVotes += data.totalVotes;
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Estadísticas Electorales {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-none shadow-none">
            <CardHeader className="px-2 py-3">
              <CardTitle className="text-base">Total de votos</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
              <p className="text-2xl font-bold">{formatNumber(totalVotes)}</p>
              {comparisonYear && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>vs {formatNumber(comparisonTotalVotes)} en {comparisonYear}</span>
                  {totalVotes > comparisonTotalVotes ? (
                    <div className="flex items-center text-green-600 ml-2">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span>
                        {calculatePercentage(
                          totalVotes - comparisonTotalVotes,
                          comparisonTotalVotes
                        )}
                      </span>
                    </div>
                  ) : totalVotes < comparisonTotalVotes ? (
                    <div className="flex items-center text-red-600 ml-2">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      <span>
                        {calculatePercentage(
                          comparisonTotalVotes - totalVotes,
                          comparisonTotalVotes
                        )}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center ml-2">
                      <Minus className="w-3 h-3 mr-1" />
                      <span>0%</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {parties.map((party) => (
            <Card key={party.id} className="border-none shadow-none">
              <CardHeader className="px-2 py-3">
                <CardTitle className="text-base flex items-center">
                  <span
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: party.color }}
                  ></span>
                  {party.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 py-0">
                <p className="text-2xl font-bold">
                  {formatNumber(totalsByParty[party.id] || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {calculatePercentage(
                    totalsByParty[party.id] || 0,
                    totalVotes
                  )}
                </p>
                
                {comparisonYear && (
                  <div className="mt-1 flex items-center text-xs text-muted-foreground">
                    <span>
                      {calculatePercentage(
                        comparisonTotalsByParty[party.id] || 0,
                        comparisonTotalVotes
                      )}{" "}
                      en {comparisonYear}
                    </span>
                    
                    {(() => {
                      const currentPerc = (totalsByParty[party.id] || 0) / totalVotes;
                      const prevPerc = (comparisonTotalsByParty[party.id] || 0) / comparisonTotalVotes;
                      const diff = (currentPerc - prevPerc) * 100;
                      
                      if (diff > 0.5) {
                        return (
                          <div className="flex items-center text-green-600 ml-2">
                            <ArrowUp className="w-3 h-3 mr-1" />
                            <span>{diff.toFixed(1)}pp</span>
                          </div>
                        );
                      } else if (diff < -0.5) {
                        return (
                          <div className="flex items-center text-red-600 ml-2">
                            <ArrowDown className="w-3 h-3 mr-1" />
                            <span>{Math.abs(diff).toFixed(1)}pp</span>
                          </div>
                        );
                      } else {
                        return (
                          <div className="flex items-center ml-2">
                            <Minus className="w-3 h-3 mr-1" />
                            <span>0pp</span>
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
