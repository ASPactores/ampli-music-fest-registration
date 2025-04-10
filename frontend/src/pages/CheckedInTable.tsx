import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useApiGet } from "@/hooks/useApi";

interface Attendee {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  checked_in: boolean;
  checked_in_at?: string;
}

interface PaginationMetadata {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page?: number;
  prev_page?: number;
}

interface PaginatedAttendeesResponse {
  attendees: Attendee[];
  pagination: PaginationMetadata;
}

export default function CheckedInAttendeesTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data,
    isPending: isLoading,
    isError,
  } = useApiGet<PaginatedAttendeesResponse>(
    `/attendees/checked-in?page=${currentPage}&page_size=${pageSize}`,
    true
  );

  const attendees = data?.attendees ?? [];
  const pagination = data?.pagination;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const handlePageChange = (page: number) => {
    if (pagination && (page < 1 || page > pagination.total_pages)) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.total_pages;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <h1 className="font-inter text-2xl lg:text-3xl font-bold text-center">
        Checked-In Participants
      </h1>
      {pagination && (
        <div className="flex items-center justify-center space-x-2 py-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
              className="h-8 w-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.total_pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(pagination.total_pages)}
            disabled={currentPage === pagination.total_pages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <ScrollArea className="h-[calc(60vh-3rem)] w-full">
        <div className="rounded-md border">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">
                  Date-Time Checked-In
                </TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone #</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>Loading...</TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={4}>Failed to load data.</TableCell>
                </TableRow>
              )}
              {!isLoading &&
                !isError &&
                attendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{formatDate(attendee.checked_in_at)}</TableCell>
                    <TableCell>{attendee.full_name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.phone_number || "-"}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </div>
      </ScrollArea>
    </div>
  );
}
