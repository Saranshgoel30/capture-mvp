
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const CallToAction = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-orange-950/10 to-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="text-center space-y-10 sm:space-y-14 lg:space-y-18">
          {/* Enhanced Main CTA Content */}
          <FadeIn>
            <div className="space-y-8 sm:space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full glass-warm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base font-semibold text-amber-700">Join the Creative Revolution</span>
              </div>
              
              {/* Headline */}
              <div className="space-y-6 sm:space-y-8">
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bebas font-bold leading-[0.9] tracking-tight px-4">
                  <span className="block text-foreground mb-3 sm:mb-4">Ready to Create</span>
                  <span className="block text-warm-gradient drop-shadow-sm">
                    Something Extraordinary?
                  </span>
                </h2>
                
                {/* Enhanced decorative element */}
                <div className="flex justify-center">
                  <div className="w-28 sm:w-36 lg:w-44 h-2 bg-warm-gradient rounded-full shadow-warm animate-pulse-subtle"></div>
                </div>
              </div>
              
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4 drop-shadow-sm">
                Join thousands of visionary creators who are already transforming the world through collaboration. Your next masterpiece awaits.
              </p>
            </div>
          </FadeIn>
          
          {/* Enhanced Action Buttons */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col gap-5 sm:gap-7 justify-center items-center px-4 pt-8 sm:pt-10">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl lg:text-2xl px-10 sm:px-14 lg:px-16 py-6 sm:py-7 lg:py-8 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary min-h-[64px] sm:min-h-[72px] touch-auto rounded-xl font-bold"
                >
                  <Sparkles className="mr-3 sm:mr-4 h-6 w-6 sm:h-7 sm:w-7 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="truncate">Start Creating Magic</span>
                  <ArrowRight className="ml-3 sm:ml-4 h-6 w-6 sm:h-7 sm:w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl lg:text-2xl px-10 sm:px-14 lg:px-16 py-6 sm:py-7 lg:py-8 border-2 border-amber-600/60 hover:border-amber-500 hover:bg-amber-900/20 backdrop-blur-sm transition-all duration-500 group min-h-[64px] sm:min-h-[72px] touch-auto rounded-xl font-semibold"
                >
                  <span className="truncate">Explore Projects</span>
                  <Star className="ml-3 sm:ml-4 h-6 w-6 sm:h-7 sm:w-7 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          
          {/* Enhanced Trust Indicators */}
          <FadeIn delay={0.4}>
            <div className="pt-12 sm:pt-16 lg:pt-20 border-t border-amber-600/30 max-w-4xl mx-auto">
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 opacity-90 font-medium">Trusted by creative minds worldwide</p>
              
              <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4">
                <div className="text-center group hover:scale-110 transition-all duration-300 touch-auto cursor-pointer">
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bebas text-warm-gradient mb-2 sm:mb-3 drop-shadow-lg">5,000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Active Creators</div>
                </div>
                
                <div className="text-center group hover:scale-110 transition-all duration-300 touch-auto cursor-pointer">
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-lg">1,500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Projects Completed</div>
                </div>
                
                <div className="text-center group hover:scale-110 transition-all duration-300 touch-auto cursor-pointer">
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-lg">100+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Countries</div>
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
