
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
      gradient: 'from-violet-500 to-purple-600',
      delay: 0.2
    },
    {
      icon: Search,
      title: 'Discover Opportunities',
      description: 'Explore handpicked projects or let our AI matchmaker connect you with opportunities that align with your creative DNA.',
      number: '02',
      gradient: 'from-blue-500 to-cyan-600',
      delay: 0.4
    },
    {
      icon: MessageCircle,
      title: 'Connect & Collaborate',
      description: 'Engage with visionary creators, share ideas, and build meaningful relationships that transcend traditional boundaries.',
      number: '03',
      gradient: 'from-emerald-500 to-teal-600',
      delay: 0.6
    },
    {
      icon: Rocket,
      title: 'Create Magic Together',
      description: 'Transform ideas into reality with seamless collaboration tools and watch your creative dreams come to life.',
      number: '04',
      gradient: 'from-orange-500 to-red-600',
      delay: 0.8
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-24">
          <FadeIn>
            <div className="space-y-8">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-50 border border-violet-100">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                <span className="text-sm font-medium text-violet-700">Simple Process</span>
              </div>
              
              {/* Title */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-bebas font-bold leading-tight tracking-tight">
                  <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Your Creative Journey
                  </span>
                  <span className="block text-foreground">Starts Here</span>
                </h2>
                
                {/* Decorative line */}
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Four simple steps to unlock a world of creative collaboration and bring your most ambitious projects to life.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Process Steps with Thoughtful Layout */}
        <div className="relative">
          {/* Connection Path - More Subtle */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent -translate-y-1/2 z-0"></div>
          
          {/* Progress Dots */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 justify-between items-center -translate-y-1/2 z-10 px-12">
            {steps.map((_, index) => (
              <div key={index} className="w-4 h-4 bg-white border-2 border-violet-300 rounded-full shadow-sm"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-20">
            {steps.map((step, index) => (
              <FadeIn key={step.title} delay={step.delay}>
                <Card className="group h-full border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 relative overflow-hidden">
                  <CardContent className="p-8 relative z-10">
                    <div className="text-center space-y-6">
                      {/* Step Number - More Prominent */}
                      <div className="relative">
                        <div className="text-8xl font-bebas text-gray-100 absolute -top-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
                          {step.number}
                        </div>
                        
                        {/* Icon */}
                        <div className={`relative z-10 inline-flex p-6 rounded-2xl bg-gradient-to-r ${step.gradient} shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                          <step.icon className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="font-bebas text-2xl text-foreground group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {step.title}
                        </h3>
                        
                        {/* Decorative line */}
                        <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 mx-auto group-hover:from-violet-400 group-hover:to-purple-400 transition-all duration-300"></div>
                        
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
