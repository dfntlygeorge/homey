"use client";

import { EDIT_LISTING_STEPS as CREATE_LISTING_STEPS } from "@/config/constants";

export const CreateListingProgressHeader = ({
  currentStep,
}: {
  currentStep: number;
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {CREATE_LISTING_STEPS.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < CREATE_LISTING_STEPS.length - 1 ? "flex-1" : ""
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                index <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index + 1}
            </div>
            {index < CREATE_LISTING_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {CREATE_LISTING_STEPS[currentStep].title}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {CREATE_LISTING_STEPS[currentStep].description}
        </p>
      </div>
    </div>
  );
};
