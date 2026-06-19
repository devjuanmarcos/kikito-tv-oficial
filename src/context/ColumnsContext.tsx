"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction, useMemo } from "react";

interface ColumnsContextProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  isUpdateDialogOpen: boolean;
  setIsUpdateDialogOpen: Dispatch<SetStateAction<boolean>>;
  isCreateBeaconDialogOpen: boolean;
  setIsCreateBeaconDialogOpen: Dispatch<SetStateAction<boolean>>;
  setItemToUpdate: React.Dispatch<React.SetStateAction<any | null>>;
  itemToDeleteId: string;
  setItemToDeleteId: React.Dispatch<React.SetStateAction<string>>;
  itemToUpdate: any;
  successMessage: string;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ColumnsContext = createContext<ColumnsContextProps | undefined>(undefined);

interface ColumnsContexProviderProps {
  children: ReactNode;
}

export const ColumnsContexProvider: React.FC<ColumnsContexProviderProps> = ({ children }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateBeaconDialogOpen, setIsCreateBeaconDialogOpen] = useState(false);

  const [itemToDeleteId, setItemToDeleteId] = useState("");
  const [itemToUpdate, setItemToUpdate] = useState<any>({} as any);

  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const contextValue = useMemo(() => {
    return {
      isDeleteDialogOpen,
      setIsDeleteDialogOpen,
      itemToDeleteId,
      setItemToDeleteId,
      successMessage,
      errorMessage,
      setSuccessMessage,
      setErrorMessage,
      isUpdateDialogOpen,
      setIsUpdateDialogOpen,
      isCreateBeaconDialogOpen,
      setIsCreateBeaconDialogOpen,
      itemToUpdate,
      setItemToUpdate,
    };
  }, [
    isDeleteDialogOpen,
    itemToDeleteId,
    successMessage,
    isUpdateDialogOpen,
    isCreateBeaconDialogOpen,
    itemToUpdate,
    errorMessage,
  ]);

  return <ColumnsContext.Provider value={contextValue}>{children}</ColumnsContext.Provider>;
};

export const useColumns = () => {
  const context = useContext(ColumnsContext);
  if (!context) {
    throw new Error("useColumnsContex must be used within a ColumnsContexProvider");
  }
  return context;
};
