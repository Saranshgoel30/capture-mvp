import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Search, MessageCircle, Rocket, Sparkles } from 'lucide-react';
import FadeIn from '@/components/ui-custom/FadeIn';
const HowItWorks = () => {
  const steps = [{
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Craft a stunning profile that showcases your unique creative vision, skills, and portfolio pieces that define your artistic journey.',
    number: '01',
    gradient: 'from-violet-500 to-purple-600',
    delay: 0.2
  }, {
    icon: Search,
    title: 'Discover Opportunities',
    description: 'Explore handpicked projects or let our AI matchmaker connect you with opportunities that align with your creative DNA.',
    number: '02',
    gradient: 'from-blue-500 to-cyan-600',
    delay: 0.4
  }, {
    icon: MessageCircle,
    title: 'Connect & Collaborate',
    description: 'Engage with visionary creators, share ideas, and build meaningful relationships that transcend traditional boundaries.',
    number: '03',
    gradient: 'from-emerald-500 to-teal-600',
    delay: 0.6
  }, {
    icon: Rocket,
    title: 'Create Magic Together',
    description: 'Transform ideas into reality with seamless collaboration tools and watch your creative dreams come to life.',
    number: '04',
    gradient: 'from-orange-500 to-red-600',
    delay: 0.8
  }];
  return <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 via-purple-900/5 to-pink-900/5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-gradient-to-r from-violet-400 to-purple-600 rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full blur-3xl opacity-10 animate-float" style={{
      animationDelay: '2s'
    }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800 mb-6">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Simple Process</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bebas font-bold mb-8">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Creative Journey
              </span>
              <br />
              <span className="text-foreground">Starts Here</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Four simple steps to unlock a world of creative collaboration and bring your most ambitious projects to life.
            </p>
          </div>
        </FadeIn>

        <div className="relative">
          {/* Connection Path */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-blue-500 via-emerald-500 to-orange-500 opacity-20 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => <FadeIn key={step.title} delay={step.delay}>
                <Card className="group h-full border-0 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 relative overflow-hidden">
                  {/* Gradient Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg`}></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col items-center text-center">
                      {/* Step Number */}
                      
                      
                      {/* Icon */}
                      <div className={`p-6 rounded-2xl bg-gradient-to-r ${step.gradient} mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl mt-6`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="font-bebas text-2xl mb-4 text-foreground group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {step.title}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;