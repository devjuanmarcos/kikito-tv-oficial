import { motion } from "motion/react";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  setQueryPagination: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
      totalItems: number;
    }>
  >;
}

const navButtonTransition = { type: "spring", stiffness: 400, damping: 17 } as const;

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, setQueryPagination }) => {
  const itemsPerPageId = React.useId();

  if (!totalItems || totalItems <= 0) {
    return null;
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  // Garante que currentPage está no formato correto (1-based)
  const displayPage = currentPage || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setQueryPagination((prev) => ({ ...prev, pageIndex: page }));
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value);
    setQueryPagination({ pageSize: newItemsPerPage, pageIndex: 1, totalItems: totalItems });
  };

  const itemsPerPageOptions = totalItems < 10 ? [totalItems] : [10, 24, 50, 80, 100, 250, 500];

  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3 sm:flex-row sm:flex-wrap sm:justify-between">
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <label htmlFor={itemsPerPageId} className="text-sm text-muted-foreground">
          Itens por página
        </label>
        <select
          id={itemsPerPageId}
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          aria-label="Selecionar quantidade de itens por página"
          className="h-9 rounded-md border border-border bg-background px-3"
        >
          {itemsPerPageOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {totalItems && <span className="text-sm text-muted-foreground sm:ml-2">Total: {totalItems}</span>}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <span className="text-sm text-muted-foreground">
          Página {displayPage} de {totalPages}
        </span>
        <div className="grid w-full grid-cols-4 gap-2 sm:flex sm:w-auto">
          <motion.button
            className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3"
            onClick={() => handlePageChange(1)}
            disabled={displayPage === 1}
            aria-label="Ir para a primeira página"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={navButtonTransition}
          >
            <FaAnglesLeft />
          </motion.button>
          <motion.button
            className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3"
            onClick={() => handlePageChange(displayPage - 1)}
            disabled={displayPage === 1}
            aria-label="Ir para a página anterior"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={navButtonTransition}
          >
            <FaAngleLeft />
          </motion.button>
          <motion.button
            className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3"
            onClick={() => handlePageChange(displayPage + 1)}
            disabled={displayPage === totalPages}
            aria-label="Ir para a próxima página"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={navButtonTransition}
          >
            <FaAngleRight />
          </motion.button>
          <motion.button
            className="flex h-9 items-center justify-center rounded-md border border-border bg-background px-3"
            onClick={() => handlePageChange(totalPages)}
            disabled={displayPage === totalPages}
            aria-label="Ir para a última página"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={navButtonTransition}
          >
            <FaAnglesRight />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
