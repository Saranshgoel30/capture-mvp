
import React from 'react';
import { Search, Users, Sparkles, ArrowRight } from 'lucide-react';
import FadeIn from './ui-custom/FadeIn';

const steps = [
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "Discover Opportunities",
    description: "Explore a wide range of creative projects looking for talented individuals across India.",
    delay: 100
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Direct Collaboration",
    description: "Reach out to project creators and fellow artists with your portfolio and innovative ideas.",
    delay: 200
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Create Together",
    description: "Collaborate seamlessly to bring your shared creative vision to life, expanding your network.",
    delay: 300
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              Simple Process
            </span>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Capture Works
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to find creative collaborations and build your artistic network without the traditional barriers.
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <FadeIn delay={step.delay}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </FadeIn>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/3 transform -translate-x-1/2 translate-y-8">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-2/3 transform -translate-x-1/2 translate-y-8">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
