
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, MessageCircle, Rocket } from 'lucide-react';
import FadeIn from '@/components/ui-custom/FadeIn';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description: 'Craft a stunning profile that showcases your unique creative vision, skills, and portfolio pieces that define your artistic journey.',
      number: '01',
      gradient: 'from-amber-600 to-orange-600',
      delay: 0.2
    },
    {
      icon: Search,
      title: 'Discover Opportunities',
      description: 'Explore handpicked projects or let our AI matchmaker connect you with opportunities that align with your creative DNA.',
      number: '02',
      gradient: 'from-orange-600 to-red-600',
      delay: 0.4
    },
    {
      icon: MessageCircle,
      title: 'Connect & Collaborate',
      description: 'Engage with visionary creators, share ideas, and build meaningful relationships that transcend traditional boundaries.',
      number: '03',
      gradient: 'from-yellow-600 to-amber-600',
      delay: 0.6
    },
    {
      icon: Rocket,
      title: 'Create Magic Together',
      description: 'Transform ideas into reality with seamless collaboration tools and watch your creative dreams come to life.',
      number: '04',
      gradient: 'from-red-600 to-orange-600',
      delay: 0.8
    }
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <FadeIn>
            <div className="space-y-6 sm:space-y-8">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full glass-warm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-amber-300">Simple Process</span>
              </div>
              
              {/* Title */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas font-bold leading-tight tracking-tight px-4">
                  <span className="block text-warm-gradient">
                    Your Creative Journey
                  </span>
                  <span className="block text-foreground">Starts Here</span>
                </h2>
                
                {/* Decorative line */}
                <div className="flex justify-center">
                  <div className="w-20 sm:w-24 lg:w-32 h-1 bg-warm-gradient rounded-full"></div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4">
                Four simple steps to unlock a world of creative collaboration and bring your most ambitious projects to life.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Process Steps - Mobile Optimized Layout */}
        <div className="relative">
          {/* Connection Path - Hidden on mobile for cleaner look */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent -translate-y-1/2 z-0"></div>
          
          {/* Progress Dots - Hidden on mobile */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 justify-between items-center -translate-y-1/2 z-10 px-12">
            {steps.map((_, index) => (
              <div key={index} className="w-4 h-4 bg-card border-2 border-amber-600/50 rounded-full shadow-sm"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-20">
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={step.delay}>
                <Card className="group h-full border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-3 relative overflow-hidden card-hover">
                  <CardContent className="p-6 sm:p-8 relative z-10">
                    <div className="text-center space-y-4 sm:space-y-6">
                      {/* Step Number - Mobile Optimized */}
                      <div className="relative">
                        <div className="text-6xl sm:text-7xl lg:text-8xl font-bebas text-muted/10 absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                          {step.number}
                        </div>
                        
                        {/* Icon */}
                        <div className={`relative z-10 inline-flex p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-r ${step.gradient} shadow-lg group-hover:shadow-warm group-hover:scale-110 transition-all duration-500`}>
                          <step.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="font-bebas text-xl sm:text-2xl text-foreground group-hover:text-warm-gradient transition-all duration-300">
                          {step.title}
                        </h3>
                        
                        {/* Decorative line */}
                        <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-muted to-muted/50 mx-auto group-hover:from-amber-600 group-hover:to-orange-600 transition-all duration-300"></div>
                        
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
