
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const CallToAction = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-amber-950/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="text-center space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Main CTA Content */}
          <FadeIn>
            <div className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full glass-warm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-amber-300">Join the Creative Revolution</span>
              </div>
              
              {/* Headline */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bebas font-bold leading-tight tracking-tight px-4">
                  <span className="block text-foreground">Ready to Create</span>
                  <span className="block text-warm-gradient">
                    Something Extraordinary?
                  </span>
                </h2>
                
                {/* Decorative element */}
                <div className="flex justify-center">
                  <div className="w-24 sm:w-32 lg:w-40 h-1 bg-warm-gradient rounded-full"></div>
                </div>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light px-4">
                Join thousands of visionary creators who are already transforming the world through collaboration. Your next masterpiece awaits.
              </p>
            </div>
          </FadeIn>
          
          {/* Action Buttons - Mobile Optimized */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col gap-4 sm:gap-6 justify-center items-center px-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary"
                >
                  <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="truncate">Start Creating Magic</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 border-2 border-amber-600/50 hover:border-amber-500 hover:bg-amber-900/30 transition-all duration-500 group"
                >
                  <span className="truncate">Explore Projects</span>
                  <Star className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          
          {/* Trust Indicators - Mobile Optimized */}
          <FadeIn delay={0.4}>
            <div className="pt-8 sm:pt-12 lg:pt-16 border-t border-amber-600/20">
              <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 opacity-80">Trusted by creative minds worldwide</p>
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-2xl mx-auto px-4">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas text-warm-gradient mb-1 sm:mb-2">5,000+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Creators</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">1,500+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects Completed</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-1 sm:mb-2">100+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Countries</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
