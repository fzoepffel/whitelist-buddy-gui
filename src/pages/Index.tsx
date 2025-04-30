import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WhitelistEntry, WhitelistFormData } from "@/types/whitelist";
import WhitelistTable from "@/components/WhitelistTable";
import WhitelistForm from "@/components/WhitelistForm";
import WhitelistSearchBar from "@/components/WhitelistSearchBar";
import { mockWhitelistData } from "@/utils/mockData";
import { Plus } from "lucide-react";

const Index = () => {
  const [whitelistData, setWhitelistData] = useState<WhitelistEntry[]>([]);
  const [filteredData, setFilteredData] = useState<WhitelistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<WhitelistEntry | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Load initial data
  useEffect(() => {
    // In a real app, you would fetch data from an API
    setWhitelistData(mockWhitelistData);
    setFilteredData(mockWhitelistData);
  }, []);

  // Filter data based on search query
  useEffect(() => {
    let result = whitelistData;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.email.toLowerCase().includes(lowerCaseQuery) ||
          (entry.sso_id !== null && 
           entry.sso_id.toString().includes(lowerCaseQuery))
      );
    }
    
    setFilteredData(result);
  }, [searchQuery, whitelistData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleAddEntry = () => {
    setCurrentEntry(undefined);
    setIsFormOpen(true);
  };

  const handleEditEntry = (entry: WhitelistEntry) => {
    setCurrentEntry(entry);
    setIsFormOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntryToDelete(id);
  };

  const confirmDelete = () => {
    if (!entryToDelete) return;
    
    setWhitelistData(whitelistData.filter(entry => entry.id !== entryToDelete));
    toast.success("Whitelist-Eintrag erfolgreich gelöscht!");
    setEntryToDelete(null);
  };

  const handleFormSubmit = (formData: WhitelistFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (currentEntry) {
        // Update existing entry - set updated_at to current timestamp
        const updated: WhitelistEntry = {
          ...currentEntry,
          ...formData,
          updated_at: new Date().toISOString(),
        };
        
        setWhitelistData(whitelistData.map(entry => 
          entry.id === currentEntry.id ? updated : entry
        ));
        
        toast.success("Whitelist-Eintrag erfolgreich aktualisiert!");
      } else {
        // Add new entry - updated_at is null for new entries
        const newEntry: WhitelistEntry = {
          ...formData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: null, // Set to null for new entries
        };
        
        setWhitelistData([newEntry, ...whitelistData]);
        toast.success("Whitelist-Eintrag erfolgreich hinzugefügt!");
      }
      
      setIsFormOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  // This function is still defined but won't be used in the table anymore
  const handleToggleSwitch = (id: string, field: string, value: boolean) => {
    const entryToUpdate = whitelistData.find(entry => entry.id === id);
    
    if (!entryToUpdate) return;
    
    // Create updated entry with new switch value and update the timestamp
    const updatedEntry = {
      ...entryToUpdate,
      [field]: value,
      updated_at: new Date().toISOString(), // Set updated_at when toggling switches
    };
    
    // Update the entry in the data
    setWhitelistData(whitelistData.map(entry => 
      entry.id === id ? updatedEntry : entry
    ));
    
    toast.success(`${field.replace(/_/g, " ")} wurde ${value ? "aktiviert" : "deaktiviert"}.`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Whitelist-Verwaltung</CardTitle>
              <CardDescription>
                Verwalten Sie Whitelist-Einträge für Testkonten.
              </CardDescription>
            </div>
            <Button onClick={handleAddEntry} className="bg-blue-500 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Neuen Eintrag hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <WhitelistSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
          
          <WhitelistTable
            data={filteredData}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
            onToggleSwitch={handleToggleSwitch}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Zeige {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredData.length)} bis {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} von {filteredData.length} Einträgen
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEntry ? "Whitelist-Eintrag bearbeiten" : "Whitelist-Eintrag hinzufügen"}
            </DialogTitle>
          </DialogHeader>
          <WhitelistForm
            entry={currentEntry}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
            existingEntries={whitelistData}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Der Whitelist-Eintrag wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
