
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
    <section className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-50/30 to-background dark:via-violet-950/30"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-violet-400 to-purple-600 rounded-full blur-3xl opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800 mb-6">
              <Star className="h-4 w-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Premium Features</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bebas font-bold mb-8">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
              <br />
              <span className="text-foreground">To Create Magic</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover powerful tools and features designed to elevate your creative journey and transform collaboration into an art form.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={feature.delay}>
              <Card className="group h-full border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 relative overflow-hidden">
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-lg`}></div>
                <div className="absolute inset-[1px] bg-background rounded-lg"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col items-center text-center">
                    {/* Animated Icon */}
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-8 group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl`}>
                      <feature.icon className="h-8 w-8 text-white relative z-10" />
                      
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`}></div>
                    </div>
                    
                    <h3 className="font-bebas text-2xl mb-4 text-foreground group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {feature.description}
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

export default Features;
