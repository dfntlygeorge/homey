import { CalendarCheck, ClipboardList, Search } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Browse Listings",
    description:
      "Explore verified listings with filters for price, location, and more.",
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Check Details",
    description:
      "Review images, rules, amenities, and real reviews to find your fit.",
  },
  {
    icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    title: "Reserve Easily",
    description:
      "Book a slot or reach out to the landlord directly — no hassle.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Finding your next boarding house shouldn&apos;t be stressful.
          Here&apos;s how easy it is:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center"
            >
              <div className="mb-4 bg-primary/10 rounded-full p-3">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
