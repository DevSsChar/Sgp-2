"use client";
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ScanDataContext = createContext();

const INITIAL_SCAN_PROGRESS = {
  phase: null,
  message: '',
  progress: 0,
  pageIndex: null,
  pageTotal: null,
  currentUrl: null,
  discovered: null,
  isScanning: false,
};

export const useScanData = () => {
  const context = useContext(ScanDataContext);
  if (!context) {
    throw new Error('useScanData must be used within a ScanDataProvider');
  }
  return context;
};

export const ScanDataProvider = ({ children }) => {
  const [currentScanData, setCurrentScanData] = useState(null);
  const [scanProgress, setScanProgress] = useState(INITIAL_SCAN_PROGRESS);

  const updateScanData = useCallback((scanData) => {
    setCurrentScanData(scanData);
  }, []);

  const clearScanData = useCallback(() => {
    setCurrentScanData(null);
  }, []);

  const updateScanProgress = useCallback((progressUpdate) => {
    setScanProgress((prev) => ({
      ...prev,
      ...progressUpdate,
      isScanning: progressUpdate.isScanning ?? prev.isScanning,
    }));
  }, []);

  const clearScanProgress = useCallback(() => {
    setScanProgress(INITIAL_SCAN_PROGRESS);
  }, []);

  const value = useMemo(
    () => ({
      scanData: currentScanData,
      updateScanData,
      clearScanData,
      scanProgress,
      updateScanProgress,
      clearScanProgress,
    }),
    [currentScanData, scanProgress, updateScanData, clearScanData, updateScanProgress, clearScanProgress]
  );

  return (
    <ScanDataContext.Provider value={value}>
      {children}
    </ScanDataContext.Provider>
  );
};
