
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
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-background via-amber-50/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Enhanced Section Header */}
        <div className="text-center mb-16 sm:mb-20 lg:mb-24">
          <FadeIn>
            <div className="space-y-6 sm:space-y-8">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full glass-warm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base font-semibold text-amber-700">Platform Features</span>
              </div>
              
              {/* Title */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas font-bold leading-tight tracking-tight px-4">
                  <span className="block text-warm-gradient mb-3 drop-shadow-sm">Everything You Need</span>
                  <span className="block text-foreground">To Create Together</span>
                </h2>
                
                {/* Enhanced decorative line */}
                <div className="flex justify-center">
                  <div className="w-20 sm:w-28 lg:w-32 h-2 bg-warm-gradient rounded-full shadow-warm animate-pulse-subtle"></div>
                </div>
              </div>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4 drop-shadow-sm">
                Our platform provides all the tools and connections you need to turn your creative vision into reality.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-16 sm:mb-20">
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={feature.delay}>
              <Card className="group h-full border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-4 card-hover rounded-2xl overflow-hidden">
                <CardHeader className="pb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-warm group-hover:scale-110 transition-all duration-500`}>
                      <feature.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-xs sm:text-sm bg-amber-100/60 text-amber-800 border-amber-200/60 px-3 py-1 font-medium rounded-full"
                    >
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bebas group-hover:text-warm-gradient transition-all duration-300 leading-tight">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-base sm:text-lg leading-relaxed text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <FadeIn delay={1.4}>
          <div className="text-center">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-7 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group btn-primary min-h-[64px] rounded-xl font-bold"
              >
                <span>Get Started Today</span>
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Features;
