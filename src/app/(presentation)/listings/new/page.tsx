import { MultiStepFormSchema } from "@/app/_schemas/form.schema";
import { auth } from "@/auth";
import { BasicInfo } from "@/components/create-listing/basic-info";
import { HouseRules } from "@/components/create-listing/house-rules";
import { LocationContact } from "@/components/create-listing/location-contact";
import { ReviewSubmit } from "@/components/create-listing/review-submit";
import { UploadPhotos } from "@/components/create-listing/upload-photos";
import { WelcomeStep } from "@/components/create-listing/welcome";
import { routes } from "@/config/routes";
import { ListingFormStep, PageProps } from "@/config/types";
import { ImagesProvider } from "@/context/create-listing/images-context";
import { notFound, redirect } from "next/navigation";

const MAP_STEP_TO_COMPONENT = {
  [ListingFormStep.WELCOME]: WelcomeStep,
  [ListingFormStep.BASIC_INFO]: BasicInfo,
  [ListingFormStep.LOCATION_CONTACT]: LocationContact,
  [ListingFormStep.HOUSE_RULES]: HouseRules,
  [ListingFormStep.UPLOAD_PHOTOS]: UploadPhotos,
  [ListingFormStep.REVIEW_SUBMIT]: ReviewSubmit,
};

const STEPS_REQUIRING_PHOTO_PROVIDER = new Set([
  ListingFormStep.UPLOAD_PHOTOS,
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

  return STEPS_REQUIRING_PHOTO_PROVIDER.has(data.step) ? (
    <ImagesProvider>{component}</ImagesProvider>
  ) : (
    component
  );
}
