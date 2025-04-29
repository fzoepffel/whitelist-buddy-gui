
import React from "react";
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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." })
    .refine(email => email.endsWith('@check24.de'), {
      message: "Email must be a @check24.de address"
    }),
  test_payment_allowed: z.boolean(),
  activity_api: z.boolean(),
  sso_id: z.string()
    .transform((val) => {
      if (!val) return null;
      const num = parseInt(val);
      return isNaN(num) ? null : num;
    })
    .nullable()
    .refine(val => val === null || (val >= 1 && val <= 2147483647), {
      message: "SSO ID must be between 1 and 2147483647"
    }),
  sso_mock_allowed: z.boolean(),
});

interface WhitelistFormProps {
  entry?: WhitelistEntry;
  onSubmit: (data: WhitelistFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const WhitelistForm: React.FC<WhitelistFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  // Define the form with proper types
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: entry?.email || "",
      test_payment_allowed: entry?.test_payment_allowed || false,
      activity_api: entry?.activity_api || false,
      sso_id: entry?.sso_id?.toString() || "",
      sso_mock_allowed: entry?.sso_mock_allowed || false,
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Convert the form data to the expected format
    const formData: WhitelistFormData = {
      email: values.email,
      test_payment_allowed: values.test_payment_allowed,
      activity_api: values.activity_api,
      sso_id: values.sso_id,
      sso_mock_allowed: values.sso_mock_allowed,
    };
    
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="user@check24.de" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="sso_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSO ID (optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="SSO ID" 
                  {...field} 
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="test_payment_allowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Test Payment Allowed</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activity_api"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Activity API</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sso_mock_allowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>SSO Mock Allowed</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {entry ? "Update" : "Add"} Whitelist Entry
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WhitelistForm;
