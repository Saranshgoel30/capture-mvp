
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, MessageCircle, Rocket } from 'lucide-react';
import FadeIn from '@/components/ui-custom/FadeIn';

const HowItWorks = () => {
  // Following Hicks Law - simple 4-step process
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Profile',
      description: 'Sign up and showcase your skills, experience, and creative portfolio.',
      number: '01'
    },
    {
      icon: Search,
      title: 'Discover Projects',
      description: 'Browse exciting projects or let our algorithm match you with perfect opportunities.',
      number: '02'
    },
    {
      icon: MessageCircle,
      title: 'Connect & Apply',
      description: 'Message project creators, submit applications, and start building relationships.',
      number: '03'
    },
    {
      icon: Rocket,
      title: 'Create Together',
      description: 'Collaborate with your team and bring amazing creative projects to life.',
      number: '04'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-accent/5">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bebas font-bold mb-6 text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in four simple steps and begin your creative journey today.
            </p>
          </div>
        </FadeIn>

        {/* Steps - Following Gestalt's Law (connected flow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.2}>
              <Card className="relative z-10 group h-full border-0 bg-card/80 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Step number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className="p-4 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors mt-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h3 className="font-bebas text-xl mb-3 text-foreground">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
