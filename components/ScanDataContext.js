"use client";
import { createContext, useContext, useState } from 'react';

const ScanDataContext = createContext();

export const useScanData = () => {
  const context = useContext(ScanDataContext);
  if (!context) {
    throw new Error('useScanData must be used within a ScanDataProvider');
  }
  return context;
};

export const ScanDataProvider = ({ children }) => {
  const [currentScanData, setCurrentScanData] = useState(null);

  const updateScanData = (scanData) => {
    setCurrentScanData(scanData);
  };

  const clearScanData = () => {
    setCurrentScanData(null);
  };

  return (
    <ScanDataContext.Provider
      value={{
        scanData: currentScanData,
        updateScanData,
        clearScanData,
      }}
    >
      {children}
    </ScanDataContext.Provider>
  );
};