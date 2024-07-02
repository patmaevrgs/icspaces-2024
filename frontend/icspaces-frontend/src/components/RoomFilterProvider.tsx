import React, { createContext, useContext, useState, ReactNode, FunctionComponent } from 'react';

// Define the types for the context values
interface RoomFilterContextType {
  selectedRoomTypes: string[];
  setSelectedRoomTypes: (roomTypes: string[]) => void;
  selectedCapacities: string[];
  setSelectedCapacities: (capacities: string[]) => void;
}

// Create a Context with an initial null value but explicitly declare the type
const RoomFilterContext = createContext<RoomFilterContextType | null>(null);

// Custom hook to use the context
export const useRoomFilter = () => {
  const context = useContext(RoomFilterContext);
  if (!context) {
    throw new Error('useRoomFilter must be used within a RoomFilterProvider');
  }
  return context;
};

// Define the interface for the provider props to ensure children is a ReactNode
interface RoomFilterProviderProps {
  children: ReactNode;
}

// Define the provider component with type FunctionComponent using the props interface
export const RoomFilterProvider: FunctionComponent<RoomFilterProviderProps> = ({ children }) => {
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedCapacities, setSelectedCapacities] = useState<string[]>([]);

    // Prepare the value object that will be passed to the provider
    const value: RoomFilterContextType = {
        selectedRoomTypes,
        setSelectedRoomTypes,
        selectedCapacities,
        setSelectedCapacities
    };

    return (
        <RoomFilterContext.Provider value={value}>
            {children}
        </RoomFilterContext.Provider>
    );
};
