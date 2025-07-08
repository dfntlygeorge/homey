"use client";

import { Flag, Heart, Share, MoreVertical, AlertTriangle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
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
import { useForm } from "react-hook-form";
import { ReportFormData, ReportFormSchema } from "@/app/_schemas/report.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReportAction } from "@/app/_actions/listings/create-report";
import { toast } from "sonner";

export const MoreListingActions = ({ listingId }: { listingId: number }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
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
      await createReportAction(data, listingId);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Auto-close modal after success
      setTimeout(() => {
        setIsReportModalOpen(false);
        setIsSubmitted(false);
        form.reset();
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Error in reporting the lisitng");
      console.error("Error submitting report:", error);
    }
  };

  const handleReportClick = () => {
    setIsDropdownOpen(false);
    setIsReportModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsReportModalOpen(false);
      setIsSubmitted(false);
      form.reset();
    }
  };

  const selectedReasons = form.watch("reasons");
  const customReason = form.watch("additionalDetails");

  // ✅ SUCCESS MODAL UI AFTER SUBMISSION
  if (isSubmitted) {
    return (
      <Dialog open={isReportModalOpen} onOpenChange={handleCloseModal}>
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
    <>
      {/* DROPDOWN TRIGGER BUTTON (3 dots icon) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {isDropdownOpen && (
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-gray-600 cursor-pointer hover:text-red-600"
              onClick={handleReportClick}
            >
              <Flag className="h-4 w-4 mr-2" />
              Report listing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-600 cursor-pointer">
              <Share className="h-4 w-4 mr-2" />
              Share listing
            </DropdownMenuItem>
            <DropdownMenuItem className="text-gray-600 cursor-pointer">
              <Heart className="h-4 w-4 mr-2" />
              Save listing
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      {/* REPORT MODAL */}
      <Dialog open={isReportModalOpen} onOpenChange={handleCloseModal}>
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
                Help us understand what&apos;s wrong with this listing. Select
                all that apply:
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
    </>
  );
};
