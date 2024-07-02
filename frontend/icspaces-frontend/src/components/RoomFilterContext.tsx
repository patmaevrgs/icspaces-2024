import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

interface RoomFilterContextType {
  selectedRoomTypes: string[];
  setSelectedRoomTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCapacities: string[];
  setSelectedCapacities: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUtility: string; 
  setSelectedUtility: React.Dispatch<React.SetStateAction<string>>; 
  selectedFeeRange: string[]; 
  setSelectedFeeRange: React.Dispatch<React.SetStateAction<string[]>>;
}

const RoomFilterContext = createContext<RoomFilterContextType | null>(null);

export const useRoomFilter = () => {
  const context = useContext(RoomFilterContext);
  if (!context) {
    throw new Error('useRoomFilter must be used within a RoomFilterProvider');
  }
  return context;
};

interface RoomFilterProviderProps {
  children: ReactNode;
}

export const RoomFilterProvider: FunctionComponent<RoomFilterProviderProps> = ({ children }) => {
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);
  const [selectedUtility, setSelectedUtility] = useState("");
  const [selectedFeeRange, setSelectedFeeRange] = useState<string[]>([]);

  const value = {
    selectedRoomTypes,
    setSelectedRoomTypes,
    selectedCapacities,
    setSelectedCapacities,
    selectedUtility,
    setSelectedUtility,
    selectedFeeRange,
    setSelectedFeeRange,
  };

  return (
    <RoomFilterContext.Provider value={value}>
      {children}
    </RoomFilterContext.Provider>
  );
};
