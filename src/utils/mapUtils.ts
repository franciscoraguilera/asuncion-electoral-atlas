
import { Party, VotingData } from "@/types";
import { parties } from "@/data/mockData";

// Get the winning party for a neighborhood based on vote data
export const getWinningParty = (votes: { [party: string]: number }): string => {
  let maxVotes = 0;
  let winningParty = "";
  
  Object.entries(votes).forEach(([party, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      winningParty = party;
    }
  });
  
  return winningParty;
};

// Get color for a neighborhood based on the winning party
export const getColorForParty = (partyId: string): string => {
  const party = parties.find(p => p.id === partyId);
  return party ? party.color : "#CCCCCC";
};

// Get style for a GeoJSON feature
export const getFeatureStyle = (
  feature: any,
  selectedParty: string | null,
  opacity: number = 0.7
) => {
  if (!feature.properties.votes) {
    return {
      fillColor: "#CCCCCC",
      weight: 1,
      opacity: 1,
      color: "#666",
      fillOpacity: 0.4,
    };
  }

  const winningParty = feature.properties.winningParty;
  
  // If a specific party is selected, highlight areas where that party is strongest
  if (selectedParty) {
    const partyVotes = feature.properties.votes[selectedParty] || 0;
    const percentage = partyVotes / feature.properties.totalVotes;
    const intensity = Math.min(0.9, Math.max(0.1, percentage * 2));
    
    const party = parties.find(p => p.id === selectedParty);
    const color = party ? party.color : "#CCCCCC";
    
    return {
      fillColor: color,
      weight: 1,
      opacity: 1,
      color: "#666",
      fillOpacity: intensity,
    };
  }

  return {
    fillColor: getColorForParty(winningParty),
    weight: 1,
    opacity: 1,
    color: "#666",
    fillOpacity: opacity,
  };
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Calculate percentage
export const calculatePercentage = (part: number, total: number): string => {
  if (total === 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}%`;
};

// Compare voting data between two years
export const getVotingTrend = (
  currentData: VotingData | undefined,
  previousData: VotingData | undefined,
  partyId: string
): { trend: "up" | "down" | "same"; difference: number } => {
  if (!currentData || !previousData) {
    return { trend: "same", difference: 0 };
  }

  const currentVotes = currentData.votes[partyId] || 0;
  const previousVotes = previousData.votes[partyId] || 0;

  const currentPercentage = currentVotes / currentData.totalVotes;
  const previousPercentage = previousVotes / previousData.totalVotes;

  const difference = (currentPercentage - previousPercentage) * 100;

  if (difference > 0.5) return { trend: "up", difference: Math.abs(difference) };
  if (difference < -0.5) return { trend: "down", difference: Math.abs(difference) };
  return { trend: "same", difference: Math.abs(difference) };
};
