import { MultiStepFormSchema } from "@/app/_schemas/form.schema";
import { auth } from "@/auth";
import { BasicInfoStep } from "@/components/create-listing/basic-info-step";
import { HouseRulesStep } from "@/components/create-listing/house-rules-step";
import { LocationContactStep } from "@/components/create-listing/location-contact-step";
import { ReviewSubmitStep } from "@/components/create-listing/review-submit-step";
import { UploadImagesStep } from "@/components/create-listing/upload-images-step";
import { WelcomeStep } from "@/components/create-listing/welcome-step";
import { routes } from "@/config/routes";
import { ListingFormStep, PageProps } from "@/config/types";
import { ImagesProvider } from "@/context/create-listing/images-context";
import { notFound, redirect } from "next/navigation";

const MAP_STEP_TO_COMPONENT = {
  [ListingFormStep.WELCOME]: WelcomeStep,
  [ListingFormStep.BASIC_INFO]: BasicInfoStep,
  [ListingFormStep.LOCATION_CONTACT]: LocationContactStep,
  [ListingFormStep.HOUSE_RULES]: HouseRulesStep,
  [ListingFormStep.UPLOAD_IMAGES]: UploadImagesStep,
  [ListingFormStep.REVIEW_SUBMIT]: ReviewSubmitStep,
};

const STEPS_REQUIRING_IMAGE_PROVIDER = new Set([
  ListingFormStep.UPLOAD_IMAGES,
  ListingFormStep.REVIEW_SUBMIT,
]);

export default async function CreateListingPage(props: PageProps) {
  const session = await auth();

  if (!session) redirect(routes.signIn);
  const searchParams = await props.searchParams;
  const step = searchParams?.step;
  const { data, success, error } = MultiStepFormSchema.safeParse({
    step: Number(step),
  });
  if (!success) {
    console.log(error);
    return notFound();
  }

  const Component = MAP_STEP_TO_COMPONENT[data.step];

  const component = <Component searchParams={searchParams} />;

  return STEPS_REQUIRING_IMAGE_PROVIDER.has(data.step) ? (
    <ImagesProvider>{component}</ImagesProvider>
  ) : (
    component
  );
}
