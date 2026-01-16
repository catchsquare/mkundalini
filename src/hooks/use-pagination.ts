import { useState, useMemo } from "react";

export interface PaginationState {
  page: number;
  pageSize: number;
}

export interface UsePaginationResult<T> {
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  startIndex: number;
  endIndex: number;
}

export function usePagination<T>(
  data: T[],
  initialPageSize = 10
): UsePaginationResult<T> {
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
  });

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pagination.pageSize);

  const paginatedData = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return data.slice(start, end);
  }, [data, pagination.page, pagination.pageSize]);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setPagination((prev) => ({ ...prev, page: validPage }));
  };

  const nextPage = () => goToPage(pagination.page + 1);
  const prevPage = () => goToPage(pagination.page - 1);

  const setPageSize = (size: number) => {
    setPagination({ page: 1, pageSize: size });
  };

  const startIndex = (pagination.page - 1) * pagination.pageSize + 1;
  const endIndex = Math.min(pagination.page * pagination.pageSize, totalItems);

  return {
    paginatedData,
    currentPage: pagination.page,
    totalPages,
    pageSize: pagination.pageSize,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    startIndex,
    endIndex,
  };
}
