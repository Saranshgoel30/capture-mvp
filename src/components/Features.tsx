
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Users, MessageCircle, Star, Shield, Zap } from 'lucide-react';
import FadeIn from '@/components/ui-custom/FadeIn';

const Features = () => {
  // Following Miller's Law - limit to 6 key features (7±2)
  const features = [
    {
      icon: Search,
      title: 'Smart Matching',
      description: 'AI-powered project matching based on your skills, interests, and availability.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Verified Creators',
      description: 'Connect with verified professionals and talented emerging artists.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Communicate seamlessly with instant messaging and project updates.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Star,
      title: 'Portfolio Showcase',
      description: 'Display your best work and discover others\' creative portfolios.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Protected transactions and verified identities for safe collaboration.',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Fast Setup',
      description: 'Get started in minutes with our streamlined onboarding process.',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bebas font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed to make creative collaboration effortless and inspiring.
            </p>
          </div>
        </FadeIn>

        {/* Features Grid - Following Gestalt's Law (grouped by similarity) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <Card className="group h-full border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center">
                    {/* Icon with gradient background */}
                    <div className={`p-4 rounded-full bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="font-bebas text-xl mb-3 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed">
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
