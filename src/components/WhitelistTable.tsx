import React from "react";
import { format } from "date-fns";
import { WhitelistEntry } from "@/types/whitelist";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface WhitelistTableProps {
  data: WhitelistEntry[];
  onEdit: (entry: WhitelistEntry) => void;
  onDelete: (id: string) => void;
  onToggleSwitch: (id: string, field: string, value: boolean) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

const WhitelistTable: React.FC<WhitelistTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleSwitch,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nie aktualisiert";
    
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Ungültiges Datum";
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageData = data.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>E-Mail</TooltipTrigger>
                    <TooltipContent>
                      <p>E-Mail-Adresse des Testkontos (muss @check24.de sein)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>SSO ID</TooltipTrigger>
                    <TooltipContent>
                      <p>Optionale SSO ID des Benutzers (1-2147483647)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Testzahlung</TooltipTrigger>
                    <TooltipContent>
                      <p>Erlaubt Testzahlungen für dieses Konto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>SSO Mock</TooltipTrigger>
                    <TooltipContent>
                      <p>Erlaubt die Verwendung des SSO Mock-Systems</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Erstellt</TooltipTrigger>
                    <TooltipContent>
                      <p>Datum und Uhrzeit der Erstellung des Eintrags</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Aktualisiert</TooltipTrigger>
                    <TooltipContent>
                      <p>Datum und Uhrzeit der letzten Aktualisierung</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Aktionen</TooltipTrigger>
                    <TooltipContent>
                      <p>Verfügbare Aktionen für den Eintrag</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Keine Whitelist-Einträge gefunden.
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.email}</TableCell>
                  <TableCell className="font-medium">{entry.sso_id}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {entry.test_payment_allowed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {entry.sso_mock_allowed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(entry.created_at)}</TableCell>
                  <TableCell className="text-sm">
                    {entry.updated_at ? formatDate(entry.updated_at) : (
                      <span className="text-muted-foreground">Nie aktualisiert</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(entry)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(entry.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default WhitelistTable;
