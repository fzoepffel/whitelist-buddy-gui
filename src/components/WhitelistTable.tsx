
import React from "react";
import { Edit, Trash } from "lucide-react";
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
import { WhitelistEntry } from "@/types/whitelist";

// Define the props interface for the component
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
  onToggleSwitch 
}) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          No whitelist entries found.
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>SSO ID</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Updated</TableHead>
            <TableHead>Test Payment</TableHead>
            <TableHead>Activity API</TableHead>
            <TableHead>SSO Mock</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.email}</TableCell>
              <TableCell>{entry.sso_id ?? "—"}</TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(entry.created_at)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(entry.updated_at)}
              </TableCell>
              <TableCell>
                <Switch 
                  checked={entry.test_payment_allowed}
                  onCheckedChange={(checked) => 
                    onToggleSwitch(entry.id, "test_payment_allowed", checked)
                  }
                  className={entry.test_payment_allowed ? "bg-green-500 data-[state=checked]:bg-green-500" : ""}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={entry.activity_api}
                  onCheckedChange={(checked) => 
                    onToggleSwitch(entry.id, "activity_api", checked)
                  }
                  className={entry.activity_api ? "bg-green-500 data-[state=checked]:bg-green-500" : ""}
                />
              </TableCell>
              <TableCell>
                <Switch 
                  checked={entry.sso_mock_allowed}
                  onCheckedChange={(checked) => 
                    onToggleSwitch(entry.id, "sso_mock_allowed", checked)
                  }
                  className={entry.sso_mock_allowed ? "bg-green-500 data-[state=checked]:bg-green-500" : ""}
                />
              </TableCell>
              <TableCell className="flex justify-end gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(entry)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4 text-blue-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-8 w-8"
                >
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WhitelistTable;
