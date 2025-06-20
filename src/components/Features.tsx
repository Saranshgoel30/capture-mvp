
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, MessageCircle, Palette, Trophy, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Creative Community',
      description: 'Connect with photographers, designers, writers, musicians, and artists from around the globe.',
      badge: 'Community',
      color: 'from-amber-600 to-orange-600',
      delay: 0.2
    },
    {
      icon: Search,
      title: 'Smart Discovery',
      description: 'Find the perfect collaborators or projects that match your creative vision and expertise.',
      badge: 'Discovery',
      color: 'from-orange-600 to-red-600',
      delay: 0.4
    },
    {
      icon: MessageCircle,
      title: 'Seamless Communication',
      description: 'Built-in messaging and collaboration tools to bring your creative projects to life.',
      badge: 'Communication',
      color: 'from-yellow-600 to-amber-600',
      delay: 0.6
    },
    {
      icon: Palette,
      title: 'Portfolio Showcase',
      description: 'Create stunning portfolios to showcase your work and attract the right opportunities.',
      badge: 'Portfolio',
      color: 'from-red-600 to-orange-600',
      delay: 0.8
    },
    {
      icon: Trophy,
      title: 'Recognition System',
      description: 'Get recognized for your contributions and build your reputation in the creative community.',
      badge: 'Recognition',
      color: 'from-amber-500 to-yellow-500',
      delay: 1.0
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your work and communications are protected with enterprise-grade security measures.',
      badge: 'Security',
      color: 'from-orange-500 to-red-500',
      delay: 1.2
    }
  ];

  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header - Mobile Optimized */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <FadeIn>
            <div className="space-y-4 sm:space-y-6">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-warm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-amber-300">Platform Features</span>
              </div>
              
              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas font-bold leading-tight tracking-tight px-4">
                  <span className="block text-warm-gradient mb-2">Everything You Need</span>
                  <span className="block text-foreground">To Create Together</span>
                </h2>
                
                {/* Decorative line */}
                <div className="flex justify-center">
                  <div className="w-16 sm:w-20 lg:w-24 h-1 bg-warm-gradient rounded-full"></div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4">
                Our platform provides all the tools and connections you need to turn your creative vision into reality.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Features Grid - Mobile First Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={feature.delay}>
              <Card className="group h-full border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-2 card-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-warm group-hover:scale-110 transition-all duration-500`}>
                      <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-amber-100/50 text-amber-800 border-amber-200/50"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bebas group-hover:text-warm-gradient transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Call to Action - Mobile Optimized */}
        <FadeIn delay={1.4}>
          <div className="text-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 bg-warm-gradient hover:shadow-warm text-white shadow-lg hover:shadow-xl transition-all duration-500 group btn-primary min-h-[3rem]"
              >
                <span className="font-medium">Get Started Today</span>
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
