"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
} from "react";

interface SortContextProps {
  sortValue: string;
  newSortValue: string;
  sortDirection: { [key: string]: "ASC" | "DESC" };
  newSortDirection: string;
  handleSortValue: (column: string) => void;
  deleteValues: () => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
  category: string;
  setCategory: React.Dispatch<SetStateAction<string>>;
  resetPagination: () => void;
}

const SortContext = createContext<SortContextProps | undefined>(undefined);

export const SortProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sortValue, setSortValue] = useState<string>("");
  const [newSortValue, setNewSortValue] = useState<string>("");
  const [newSortDirection, setNewSortDirection] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<{
    [key: string]: "ASC" | "DESC";
  }>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 8 });
  const [category, setCategory] = useState<string>("");

  const resetPagination = () => {
    setPagination({ pageIndex: 0, pageSize: 8 });
  };

  const handleSortValue = (column: string) => {
    const currentDirection = sortDirection[column];
    const newDirection = currentDirection === "ASC" ? "DESC" : "ASC";
    setSortDirection({ ...sortDirection, [column]: newDirection });
    setSortValue(`${column},${newDirection}`);
    setNewSortValue(`${column}`);
    setNewSortDirection(newDirection);
  };

  const deleteValues = () => {
    setSortValue("");
    setNewSortValue("");
    setNewSortDirection("");
  };

  return (
    <SortContext.Provider
      value={{
        sortValue,
        sortDirection,
        handleSortValue,
        deleteValues,
        newSortValue,
        newSortDirection,
        pagination,
        setPagination,
        resetPagination,
        category,
        setCategory,
      }}
    >
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => {
  const context = useContext(SortContext);
  if (context === undefined) {
    throw new Error("useSort must be used within a SortProvider");
  }
  return context;
};
