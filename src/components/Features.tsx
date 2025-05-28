
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, MessageCircle, Star, Shield, Zap } from 'lucide-react';
import FadeIn from '@/components/ui-custom/FadeIn';

const Features = () => {
  const features = [
    {
      icon: Search,
      title: 'AI-Powered Matching',
      description: 'Our intelligent algorithm connects you with perfect collaborators based on your creative DNA and project vision.',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      icon: Users,
      title: 'Elite Creator Network',
      description: 'Join a curated community of verified professionals and emerging talents who are reshaping creative industries.',
      gradient: 'from-purple-500 to-pink-500',
      delay: 0.2
    },
    {
      icon: MessageCircle,
      title: 'Seamless Communication',
      description: 'Experience fluid collaboration with real-time messaging, project updates, and integrated creative tools.',
      gradient: 'from-emerald-500 to-teal-500',
      delay: 0.3
    },
    {
      icon: Star,
      title: 'Showcase Excellence',
      description: 'Present your masterpieces in stunning portfolio galleries that captivate and inspire potential collaborators.',
      gradient: 'from-orange-500 to-red-500',
      delay: 0.4
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Create with confidence knowing your work and data are protected by enterprise-grade security measures.',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 0.5
    },
    {
      icon: Zap,
      title: 'Lightning Setup',
      description: 'From idea to collaboration in minutes with our streamlined onboarding that gets you creating instantly.',
      gradient: 'from-yellow-500 to-orange-500',
      delay: 0.6
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background to-violet-50/30">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        {/* Section Header with Thoughtful Spacing */}
        <div className="text-center mb-24">
          <FadeIn>
            <div className="space-y-8">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-50 border border-violet-100">
                <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
                <span className="text-sm font-medium text-violet-700">Premium Features</span>
              </div>
              
              {/* Main Title with Better Typography Hierarchy */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-bebas font-bold leading-tight tracking-tight">
                  <span className="block text-foreground">Everything You Need</span>
                  <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    To Create Magic
                  </span>
                </h2>
                
                {/* Decorative Accent */}
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              
              {/* Refined Description */}
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Discover powerful tools and features designed to elevate your creative journey and transform collaboration into an art form.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Features Grid with Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={feature.delay}>
              {/* Varying heights for visual interest */}
              <div className={`${index === 1 || index === 4 ? 'lg:mt-12' : ''} ${index === 2 || index === 5 ? 'lg:mt-6' : ''}`}>
                <Card className="group h-full border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden">
                  {/* Subtle gradient border on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                  <div className="absolute inset-[1px] bg-white/90 rounded-lg group-hover:bg-white transition-colors duration-500"></div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="space-y-6">
                      {/* Icon with thoughtful positioning */}
                      <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:shadow-xl transition-all duration-500`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        
                        {/* Feature number */}
                        <div className="text-6xl font-bebas text-gray-100 group-hover:text-gray-200 transition-colors duration-500">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                      </div>
                      
                      {/* Content with refined spacing */}
                      <div className="space-y-4">
                        <h3 className="font-bebas text-2xl text-foreground group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {feature.title}
                        </h3>
                        
                        <div className="w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 group-hover:from-violet-400 group-hover:to-purple-400 transition-all duration-300"></div>
                        
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
