
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WhitelistEntry, WhitelistFormData } from "@/types/whitelist";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface WhitelistFormProps {
  entry?: WhitelistEntry;
  onSubmit: (data: WhitelistFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  test_payment_allowed: z.boolean().default(false),
  activity_api: z.boolean().default(false),
  sso_id: z.union([z.number().int().positive().nullable(), z.literal("")])
    .transform(val => val === "" ? null : val)
    .nullable()
    .optional(),
  sso_mock_allowed: z.boolean().default(false),
});

const WhitelistForm: React.FC<WhitelistFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const form = useForm<WhitelistFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: entry?.email ?? "",
      test_payment_allowed: entry?.test_payment_allowed ?? false,
      activity_api: entry?.activity_api ?? false,
      sso_id: entry?.sso_id ?? null,
      sso_mock_allowed: entry?.sso_mock_allowed ?? false,
    },
  });

  const handleSubmit = (data: WhitelistFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="user@example.com" {...field} />
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
              <FormLabel htmlFor="sso_id">SSO ID (optional)</FormLabel>
              <FormControl>
                <Input
                  id="sso_id"
                  placeholder="123456"
                  type="number"
                  {...field}
                  value={field.value === null ? "" : field.value}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value ? parseInt(value, 10) : "");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="test_payment_allowed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Test Payment</FormLabel>
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activity API</FormLabel>
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
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">SSO Mock</FormLabel>
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

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : entry ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WhitelistForm;
