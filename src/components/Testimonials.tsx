
import React from 'react';
import FadeIn from './ui-custom/FadeIn';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "I found my entire film crew through Capture. The platform made it easy to connect with talented individuals who were passionate about my project.",
    name: "Aarav Patel",
    role: "Independent Filmmaker",
    avatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    quote: "As a photographer just starting out, Capture helped me find collaborative projects that built my portfolio and connected me with other creatives in my city.",
    name: "Priya Sharma",
    role: "Photographer",
    avatar: "https://i.pravatar.cc/150?img=47"
  },
  {
    quote: "The direct connection between project creators and artists is what makes Capture special. No middlemen means better communication and more authentic collaborations.",
    name: "Vikram Singh",
    role: "Sound Designer",
    avatar: "https://i.pravatar.cc/150?img=68"
  }
];

const TestimonialCard: React.FC<{
  quote: string;
  name: string;
  role: string;
  avatar: string;
}> = ({ quote, name, role, avatar }) => {
  return (
    <div className="bg-card/70 backdrop-blur-sm p-8 rounded-xl border border-border">
      <div className="flex flex-col h-full">
        <div className="mb-6 flex-grow">
          <p className="italic text-lg">"{quote}"</p>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="font-semibold">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-6 md:px-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              Success Stories
            </span>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Our Community
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from creatives who have found meaningful collaborations and opportunities through our platform.
            </p>
          </FadeIn>
        </div>
        
        <FadeIn delay={300}>
          <div className="w-full max-w-5xl mx-auto px-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                    <div className="p-1">
                      <TestimonialCard {...testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-8">
                <CarouselPrevious className="relative static mr-2 translate-y-0" />
                <CarouselNext className="relative static ml-2 translate-y-0" />
              </div>
            </Carousel>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Testimonials;
