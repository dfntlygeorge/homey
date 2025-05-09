import { QuoteIcon, StarIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const testimonials = [
  {
    name: "Jessa Mae",
    school: "UP Baguio – BS Psychology",
    quote:
      "I finally found a safe and affordable boarding house — with Wi-Fi and a kitchen!",
    image: "https://picsum.photos/200/300?blur",
  },
  {
    name: "Mark Angelo",
    school: "SLU – Engineering Student",
    quote:
      "What I love is the transparency. No hidden fees, and I reserved online in minutes.",
    image: "https://picsum.photos/200/301?blur",
  },
  {
    name: "Karen",
    school: "UB – Nursing",
    quote:
      "The caretaker is super nice, and the no-curfew policy is perfect for my night shifts.",
    image: "https://picsum.photos/200/302?blur",
  },
];

export const TestimonialSection = () => {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container px-4 mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          Real feedback from boarders who found their place with us.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <Card key={idx} className="p-6 rounded-2xl shadow-sm">
              <CardContent className="flex flex-col items-center text-center space-y-4">
                <QuoteIcon className="text-primary w-6 h-6" />
                <p className="text-sm italic text-muted-foreground">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.image} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.school}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-yellow-500" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
