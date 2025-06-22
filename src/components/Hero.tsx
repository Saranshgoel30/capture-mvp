
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Users, Trophy, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50/50 via-orange-50/30 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Floating accent elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-2 h-2 bg-amber-400/40 rounded-full animate-pulse-subtle"></div>
        <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-orange-400/30 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 left-[20%] w-1.5 h-1.5 bg-red-400/35 rounded-full animate-pulse-subtle"></div>
        <div className="absolute bottom-1/4 right-[25%] w-2.5 h-2.5 bg-yellow-400/25 rounded-full animate-float"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-6xl">
        <div className="text-center space-y-8 sm:space-y-12 py-16 sm:py-20">
          
          {/* Professional badge */}
          <FadeIn>
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full glass-warm shadow-lg hover:shadow-xl transition-all duration-500 border border-amber-200/30">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-semibold text-amber-700 tracking-wide">
                Professional Creative Network
              </span>
            </div>
          </FadeIn>

          {/* Main headline - Professional typography */}
          <FadeIn delay={0.15}>
            <div className="space-y-6 sm:space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bebas font-bold leading-[0.9] tracking-tight">
                <span className="block text-foreground mb-2 sm:mb-3">
                  Where Creativity
                </span>
                <span className="block text-warm-gradient drop-shadow-sm">
                  Meets Excellence
                </span>
              </h1>
              
              {/* Professional accent line */}
              <div className="flex justify-center">
                <div className="w-16 sm:w-24 h-1 bg-warm-gradient rounded-full shadow-warm"></div>
              </div>
            </div>
          </FadeIn>

          {/* Professional subtitle */}
          <FadeIn delay={0.3}>
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light">
                Connect with world-class creators, collaborate on groundbreaking projects, and transform your creative vision into reality through our professional network.
              </p>
            </div>
          </FadeIn>

          {/* Professional CTA buttons */}
          <FadeIn delay={0.45}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-6">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg font-semibold px-8 sm:px-12 py-4 sm:py-5 bg-warm-gradient hover:shadow-warm text-white shadow-xl hover:shadow-2xl transition-all duration-500 group rounded-xl min-h-[56px] sm:min-h-[64px] border-0"
                >
                  <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Start Creating</span>
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/find-creators" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg font-semibold px-8 sm:px-12 py-4 sm:py-5 border-2 border-amber-300/60 hover:border-amber-400 hover:bg-amber-50 transition-all duration-300 group rounded-xl min-h-[56px] sm:min-h-[64px] backdrop-blur-sm"
                >
                  <span>Explore Network</span>
                  <Star className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Professional stats section */}
          <FadeIn delay={0.6}>
            <div className="pt-16 sm:pt-20 border-t border-amber-200/30 max-w-4xl mx-auto">
              <p className="text-sm sm:text-base text-muted-foreground mb-10 sm:mb-12 font-medium opacity-80">
                Trusted by creative professionals worldwide
              </p>
              
              <div className="grid grid-cols-3 gap-8 sm:gap-12">
                <div className="text-center group">
                  <div className="mb-3 sm:mb-4">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-amber-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas text-warm-gradient mb-2 drop-shadow-sm">
                    5,000+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    Active Creators
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="mb-3 sm:mb-4">
                    <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    1,500+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    Projects Done
                  </div>
                </div>
                
                <div className="text-center group">
                  <div className="mb-3 sm:mb-4">
                    <Globe className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-600 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2 drop-shadow-sm">
                    100+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                    Countries
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default Hero;
