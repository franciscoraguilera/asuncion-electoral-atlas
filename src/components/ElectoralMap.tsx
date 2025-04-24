
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card } from "@/components/ui/card";
import { getFeatureStyle } from "@/utils/mapUtils";
import { MapFilters, NeighborhoodProperties, VotingData } from "@/types";
import { mockVotingData } from "@/data/mockData";
import { Loader2 } from "lucide-react";

// Import shp from shpjs
import shp from "shpjs";

// Map recenter component to allow programmatic recentering
const MapRecenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position, map]);
  return null;
};

interface ElectoralMapProps {
  filters: MapFilters;
}

const ElectoralMap: React.FC<ElectoralMapProps> = ({ filters }) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<
    { properties: NeighborhoodProperties } | null
  >(null);

  const asuncionCenter: [number, number] = [-25.2968361, -57.6281667];

  // This would normally load from a backend API
  useEffect(() => {
    const loadShapefiles = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would fetch shapefiles from a server
        // For now, we'll use mock data
        
        // Simulate loading shapefiles
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // This is a placeholder. Normally we'd load actual shapefile data
        // which would be processed on the server or loaded via an API
        const filteredVotingData = mockVotingData.filter(
          (data) => data.year === filters.year
        );
        
        // Create a simplified GeoJSON for demonstration
        // In a real app, this would come from the actual shapefile data
        const features = [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-57.63, -25.28],
                  [-57.62, -25.28],
                  [-57.62, -25.29],
                  [-57.63, -25.29],
                  [-57.63, -25.28],
                ],
              ],
            },
            properties: {
              id: "1",
              name: "Barrio Jara",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-57.62, -25.28],
                  [-57.61, -25.28],
                  [-57.61, -25.29],
                  [-57.62, -25.29],
                  [-57.62, -25.28],
                ],
              ],
            },
            properties: {
              id: "2",
              name: "San Roque",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-57.63, -25.29],
                  [-57.62, -25.29],
                  [-57.62, -25.30],
                  [-57.63, -25.30],
                  [-57.63, -25.29],
                ],
              ],
            },
            properties: {
              id: "3",
              name: "Villa Morra",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-57.62, -25.29],
                  [-57.61, -25.29],
                  [-57.61, -25.30],
                  [-57.62, -25.30],
                  [-57.62, -25.29],
                ],
              ],
            },
            properties: {
              id: "4",
              name: "Recoleta",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-57.61, -25.28],
                  [-57.60, -25.28],
                  [-57.60, -25.29],
                  [-57.61, -25.29],
                  [-57.61, -25.28],
                ],
              ],
            },
            properties: {
              id: "5",
              name: "Trinidad",
            },
          },
        ];
        
        // Enhance the features with vote data
        const enhancedFeatures = features.map(feature => {
          const neighborhood = filteredVotingData.find(
            data => data.neighborhood === feature.properties.name
          );
          
          if (neighborhood) {
            let winningParty = "";
            let maxVotes = 0;
            
            Object.entries(neighborhood.votes).forEach(([party, votes]) => {
              if (votes > maxVotes) {
                maxVotes = votes;
                winningParty = party;
              }
            });
            
            return {
              ...feature,
              properties: {
                ...feature.properties,
                votes: { ...neighborhood.votes },
                totalVotes: neighborhood.totalVotes,
                winningParty,
                winningPercentage: maxVotes / neighborhood.totalVotes,
              },
            };
          }
          
          return feature;
        });
        
        const geoJsonObject = {
          type: "FeatureCollection",
          features: enhancedFeatures,
        };
        
        setGeoJsonData(geoJsonObject);
      } catch (error) {
        console.error("Error loading shapefile data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadShapefiles();
  }, [filters.year]);
  
  const onEachFeature = (feature: any, layer: L.Layer) => {
    // Add event handlers
    layer.on({
      mouseover: () => {
        setSelectedFeature({ properties: feature.properties });
        layer.setStyle({ weight: 2, opacity: 1, color: "#000" });
      },
      mouseout: () => {
        setSelectedFeature(null);
        layer.setStyle({ weight: 1, opacity: 1, color: "#666" });
      },
      click: () => {
        console.log("Feature clicked:", feature.properties);
      },
    });
    
    // Add tooltip
    if (feature.properties.name) {
      layer.bindTooltip(feature.properties.name, {
        permanent: false,
        direction: "center",
        className: "custom-tooltip",
      });
    }
  };

  // Create a style function for GeoJSON components
  const styleFunction = (feature: any) => {
    return getFeatureStyle(feature, filters.party);
  };

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh] bg-secondary/50">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-lg font-medium">Cargando datos del mapa...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            className="h-[70vh]"
            zoom={13}
            scrollWheelZoom={true}
            bounds={L.latLngBounds([
              [-25.35, -57.70],
              [-25.25, -57.55]
            ])}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapRecenter position={asuncionCenter} />

            {geoJsonData && (
              <GeoJSON
                key={filters.year + (filters.party || 'all')}
                data={geoJsonData}
                pathOptions={{
                  color: '#666',
                  weight: 1,
                  opacity: 1,
                }}
                eventHandlers={{
                  click: (e: any) => {
                    console.log("Feature clicked:", e.layer.feature.properties);
                  },
                  mouseover: (e: any) => {
                    const layer = e.layer;
                    setSelectedFeature({ properties: layer.feature.properties });
                    layer.setStyle({ weight: 2, opacity: 1, color: "#000" });
                  },
                  mouseout: (e: any) => {
                    const layer = e.layer;
                    setSelectedFeature(null);
                    layer.setStyle({ weight: 1, opacity: 1, color: "#666" });
                  },
                }}
                style={styleFunction}
              />
            )}
          </MapContainer>
        )}
      </Card>

      {selectedFeature && (
        <div className="absolute bottom-5 left-5 bg-white p-3 rounded shadow-lg max-w-xs z-[1000] border border-border">
          <h3 className="font-medium mb-1">{selectedFeature.properties.name}</h3>
          {selectedFeature.properties.votes && (
            <div className="text-sm">
              <p className="mb-1">
                Total de votos: {selectedFeature.properties.totalVotes?.toLocaleString()}
              </p>
              <div className="h-1 w-full bg-gray-200 rounded-full mb-2">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${(selectedFeature.properties.winningPercentage || 0) * 100}%`,
                    backgroundColor: selectedFeature.properties.winningParty === "anr" ? "#E63946"
                      : selectedFeature.properties.winningParty === "plra" ? "#457B9D"
                      : selectedFeature.properties.winningParty === "pq" ? "#2A9D8F"
                      : selectedFeature.properties.winningParty === "independents" ? "#E9C46A"
                      : "#9D4EDD",
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ElectoralMap;
