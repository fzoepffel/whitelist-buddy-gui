
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
import { Pencil, Trash2 } from "lucide-react";

interface WhitelistTableProps {
  data: WhitelistEntry[];
  onEdit: (entry: WhitelistEntry) => void;
  onDelete: (id: string) => void;
  onToggleSwitch: (id: string, field: string, value: boolean) => void;
}

const WhitelistTable: React.FC<WhitelistTableProps> = ({
  data,
  onEdit,
  onDelete,
  onToggleSwitch,
}) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never updated";
    
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (error) {
      return "Invalid Date";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">ID</TableHead>
            <TableHead className="w-[250px]">Email</TableHead>
            <TableHead>Test Payment</TableHead>
            <TableHead>Activity API</TableHead>
            <TableHead>SSO ID</TableHead>
            <TableHead>SSO Mock</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                No whitelist entries found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-mono text-xs truncate" title={entry.id}>
                  {entry.id.substring(0, 8)}...
                </TableCell>
                <TableCell className="font-medium">{entry.email}</TableCell>
                <TableCell>
                  <Switch
                    checked={entry.test_payment_allowed}
                    disabled={true}
                    className="cursor-not-allowed opacity-70"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={entry.activity_api}
                    disabled={true}
                    className="cursor-not-allowed opacity-70"
                  />
                </TableCell>
                <TableCell>
                  {entry.sso_id ? (
                    <span className="font-medium">{entry.sso_id}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={entry.sso_mock_allowed}
                    disabled={true}
                    className="cursor-not-allowed opacity-70"
                  />
                </TableCell>
                <TableCell className="text-sm">{formatDate(entry.created_at)}</TableCell>
                <TableCell className="text-sm">
                  {entry.updated_at ? formatDate(entry.updated_at) : (
                    <span className="text-muted-foreground">Never updated</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WhitelistTable;
