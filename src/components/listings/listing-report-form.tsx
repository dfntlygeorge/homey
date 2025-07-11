"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { REPORT_REASONS } from "@/config/constants";
import { ReportFormData, ReportFormSchema } from "@/app/_schemas/report.schema";
import { createReportAction } from "@/app/_actions/listings/create-report";

interface ListingReportFormProps {
  listingId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const ListingReportForm = ({
  listingId,
  isOpen,
  onClose,
  onSuccess,
  onError,
}: ListingReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize form with React Hook Form
  const form = useForm<ReportFormData>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      reasons: [],
      additionalDetails: "",
    },
  });

  const handleReasonToggle = (reasonId: string) => {
    const currentReasons = form.getValues().reasons;
    const updatedReasons = currentReasons.includes(reasonId)
      ? currentReasons.filter((id) => id !== reasonId)
      : [...currentReasons, reasonId];

    form.setValue("reasons", updatedReasons);
    form.trigger("reasons"); // Trigger validation
  };

  const handleSubmitReport = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      const response = await createReportAction(data, listingId);

      if (!response?.success) {
        setIsSubmitting(false);
        const errorMessage =
          response?.message || "Failed to submit report. Please try again.";
        toast.error(errorMessage);
        onError?.(errorMessage);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Report submitted successfully!");
      onSuccess?.();

      // Auto-close modal after success
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setIsSubmitting(false);
      const errorMessage =
        "An unexpected error occurred while submitting the report.";
      toast.error(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      onClose();
      setIsSubmitted(false);
      form.reset();
    }
  };

  const selectedReasons = form.watch("reasons");
  const customReason = form.watch("additionalDetails");

  // ✅ SUCCESS MODAL UI AFTER SUBMISSION
  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogTitle className="hidden" aria-label="hidden">
            SUBMITTED
          </DialogTitle>
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Report Submitted
            </h3>
            <p className="text-gray-600">
              Thank you for helping keep our community safe. We&apos;ll review
              this report shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              Report this listing
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* FORM WRAPPER */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmitReport)}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600">
              Help us understand what&apos;s wrong with this listing. Select all
              that apply:
            </p>

            {/* REASONS FIELD */}
            <FormField
              control={form.control}
              name="reasons"
              render={() => (
                <FormItem>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {REPORT_REASONS.map((reason) => (
                      <FormField
                        key={reason.id}
                        control={form.control}
                        name="reasons"
                        render={() => (
                          <FormItem
                            key={reason.id}
                            className="flex flex-row items-center space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={selectedReasons.includes(reason.id)}
                                onCheckedChange={() =>
                                  handleReasonToggle(reason.id)
                                }
                              />
                            </FormControl>
                            <FormLabel className="flex-1 cursor-pointer font-normal">
                              {reason.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CUSTOM REASON FIELD */}
            <FormField
              control={form.control}
              name="additionalDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional details (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide any additional context or details..."
                      className="min-h-20"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      {customReason?.length || 0}/500 characters
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {/* FORM ACTIONS */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white min-w-24"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
