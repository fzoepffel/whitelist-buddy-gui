import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { WhitelistEntry, WhitelistFormData } from "@/types/whitelist";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." })
    .refine(email => email.endsWith('@check24.de'), {
      message: "E-Mail muss eine @check24.de Adresse sein"
    }),
  test_payment_allowed: z.boolean(),
  sso_id: z.string()
    .min(1, { message: "SSO ID ist erforderlich" })
    .transform((val) => {
      const num = parseInt(val);
      if (isNaN(num)) {
        throw new Error("SSO ID muss eine Zahl sein");
      }
      return num;
    })
    .refine(val => val >= 1 && val <= 2147483647, {
      message: "SSO ID muss zwischen 1 und 2147483647 liegen"
    }),
  sso_mock_allowed: z.boolean(),
});

// Define the type for the form values based on the schema
type FormValues = z.infer<typeof formSchema>;

interface WhitelistFormProps {
  entry?: WhitelistEntry;
  onSubmit: (data: WhitelistFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  existingEntries: WhitelistEntry[];
}

const WhitelistForm: React.FC<WhitelistFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  isSubmitting,
  existingEntries
}) => {
  const [emailError, setEmailError] = useState<string | null>(null);
  const [ssoIdError, setSsoIdError] = useState<string | null>(null);

  // Define the form with proper types
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: entry?.email || "",
      test_payment_allowed: entry?.test_payment_allowed || false,
      sso_id: entry?.sso_id || 0,
      sso_mock_allowed: entry?.sso_mock_allowed || false,
    }
  });

  const handleSubmit = (values: FormValues) => {
    // Reset errors
    setEmailError(null);
    setSsoIdError(null);

    // Check if email or SSO ID already exists (excluding current entry if editing)
    const isEmailExists = existingEntries.some(
      e => e.email.toLowerCase() === values.email.toLowerCase() && 
           (!entry || (e.id !== entry.id && e.email.toLowerCase() !== entry.email.toLowerCase()))
    );
    
    const isSsoIdExists = existingEntries.some(
      e => e.sso_id === values.sso_id && 
           (!entry || (e.id !== entry.id && e.sso_id !== entry.sso_id))
    );

    if (isEmailExists) {
      setEmailError("Diese E-Mail-Adresse existiert bereits.");
      return;
    }

    if (isSsoIdExists) {
      setSsoIdError("Diese SSO ID existiert bereits.");
      return;
    }

    // Convert the form data to the expected format
    const formData: WhitelistFormData = {
      email: values.email,
      test_payment_allowed: values.test_payment_allowed,
      sso_id: values.sso_id,
      sso_mock_allowed: values.sso_mock_allowed,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="test@check24.de"
                  {...field}
                  className={cn(emailError && "border-red-500")}
                />
              </FormControl>
              {emailError && <FormMessage>{emailError}</FormMessage>}
              {!emailError && form.formState.errors.email && (
                <FormMessage>{form.formState.errors.email.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sso_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSO ID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1001"
                  {...field}
                  className={cn(ssoIdError && "border-red-500")}
                />
              </FormControl>
              {ssoIdError && <FormMessage>{ssoIdError}</FormMessage>}
              {!ssoIdError && form.formState.errors.sso_id && (
                <FormMessage>{form.formState.errors.sso_id.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="test_payment_allowed"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Testzahlung erlaubt</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={cn(
                      field.value ? "bg-green-500 data-[state=checked]:bg-green-500" : ""
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sso_mock_allowed"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>SSO Mock erlaubt</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={cn(
                      field.value ? "bg-green-500 data-[state=checked]:bg-green-500" : ""
                    )}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Abbrechen
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700">
            Whitelist-Eintrag {entry ? "Aktualisieren" : "Hinzufügen"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WhitelistForm;
