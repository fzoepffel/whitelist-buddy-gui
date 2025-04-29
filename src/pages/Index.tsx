
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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

  // Load initial data
  useEffect(() => {
    // In a real app, you would fetch data from an API
    setWhitelistData(mockWhitelistData);
    setFilteredData(mockWhitelistData);
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(whitelistData);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = whitelistData.filter(
      (entry) =>
        entry.email.toLowerCase().includes(lowerCaseQuery) ||
        (entry.sso_id !== null && 
         entry.sso_id.toString().includes(lowerCaseQuery))
    );
    
    setFilteredData(filtered);
  }, [searchQuery, whitelistData]);

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
    toast.success("Whitelist entry deleted successfully!");
    setEntryToDelete(null);
  };

  const handleFormSubmit = (formData: WhitelistFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (currentEntry) {
        // Update existing entry
        const updated: WhitelistEntry = {
          ...currentEntry,
          ...formData,
          updated_at: new Date().toISOString(),
        };
        
        setWhitelistData(whitelistData.map(entry => 
          entry.id === currentEntry.id ? updated : entry
        ));
        
        toast.success("Whitelist entry updated successfully!");
      } else {
        // Add new entry
        const newEntry: WhitelistEntry = {
          ...formData,
          id: uuidv4(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setWhitelistData([newEntry, ...whitelistData]);
        toast.success("Whitelist entry added successfully!");
      }
      
      setIsFormOpen(false);
      setIsSubmitting(false);
    }, 500);
  };

  const handleToggleSwitch = (id: string, field: string, value: boolean) => {
    const entryToUpdate = whitelistData.find(entry => entry.id === id);
    
    if (!entryToUpdate) return;
    
    // Create updated entry with new switch value
    const updatedEntry = {
      ...entryToUpdate,
      [field]: value,
      updated_at: new Date().toISOString(),
    };
    
    // Update the entry in the data
    setWhitelistData(whitelistData.map(entry => 
      entry.id === id ? updatedEntry : entry
    ));
    
    toast.success(`${field.replace(/_/g, " ")} was ${value ? "enabled" : "disabled"}.`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Whitelist Management</CardTitle>
              <CardDescription>
                Manage system whitelist entries for testing accounts.
              </CardDescription>
            </div>
            <Button onClick={handleAddEntry}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
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
          />
          
          {filteredData.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredData.length} of {whitelistData.length} entries
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentEntry ? "Edit Whitelist Entry" : "Add Whitelist Entry"}
            </DialogTitle>
          </DialogHeader>
          <WhitelistForm
            entry={currentEntry}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!entryToDelete} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the whitelist entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
