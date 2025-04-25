
export interface VotingData {
  id: string;
  neighborhood: string;
  votes: {
    [party: string]: number;
  };
  totalVotes: number;
  year: number;
  locations: VotingLocation[];
}

export interface ElectionYear {
  value: number;
  label: string;
}

export interface Party {
  id: string;
  name: string;
  color: string;
}

export interface VotingLocation {
  id: string;
  name: string;
  address: string;
  votes: {
    [party: string]: number;
  };
  totalVotes: number;
}

export interface NeighborhoodProperties {
  id: string;
  name: string;
  votes?: {
    [party: string]: number;
  };
  totalVotes?: number;
  winningParty?: string;
  winningPercentage?: number;
}

export interface GeoJsonData {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[][][] | number[][][][];
    };
    properties: NeighborhoodProperties;
  }>;
}

export interface MapFilters {
  year: number;
  party: string | null;
  comparisonYear: number | null;
}
