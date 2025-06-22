
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen-mobile flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 px-4 sm:px-6 safe-area-inset-top safe-area-inset-bottom">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 sm:opacity-20"></div>
      
      {/* Floating Elements - More subtle on mobile */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full animate-float opacity-40 sm:opacity-60"></div>
        <div className="absolute top-40 right-20 w-4 h-4 sm:w-6 sm:h-6 bg-orange-400 rounded-full animate-pulse-subtle opacity-30 sm:opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-float opacity-35 sm:opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-3 h-3 sm:w-5 sm:h-5 bg-yellow-400 rounded-full animate-pulse-subtle opacity-25 sm:opacity-30"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12 py-8 sm:py-12 lg:py-16">
          {/* Badge - Enhanced Mobile Design */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-3 sm:px-5 sm:py-3 rounded-full glass-warm text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 touch-auto">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-amber-700">Creative Platform</span>
            </div>
          </FadeIn>

          {/* Main Headline - Better Mobile Typography */}
          <FadeIn delay={0.2}>
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bebas font-bold leading-[0.85] tracking-tight px-2">
                <span className="block text-foreground mb-3 sm:mb-4">Where Creativity</span>
                <span className="block text-warm-gradient drop-shadow-sm">Meets Collaboration</span>
              </h1>
              
              {/* Enhanced decorative underline */}
              <div className="flex justify-center">
                <div className="w-24 sm:w-32 lg:w-40 h-2 bg-warm-gradient rounded-full shadow-warm animate-pulse-subtle"></div>
              </div>
            </div>
          </FadeIn>

          {/* Subtitle - Better Mobile Readability */}
          <FadeIn delay={0.4}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4 drop-shadow-sm">
              Connect with visionary creators, discover extraordinary projects, and bring your most ambitious creative dreams to life through the power of collaboration.
            </p>
          </FadeIn>

          {/* Enhanced CTA Buttons */}
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 pt-6 sm:pt-8">
              <Link to="/signup" className="w-full sm:w-auto max-w-sm">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 lg:px-14 py-6 sm:py-7 lg:py-8 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary min-h-[60px] sm:min-h-[64px] touch-auto rounded-xl"
                >
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-bold">Start Creating</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects" className="w-full sm:w-auto max-w-sm">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-12 lg:px-14 py-6 sm:py-7 lg:py-8 border-2 border-amber-600/60 hover:border-amber-500 hover:bg-amber-900/20 transition-all duration-500 group min-h-[60px] sm:min-h-[64px] touch-auto rounded-xl backdrop-blur-sm"
                >
                  <span className="font-semibold">Explore Projects</span>
                  <Star className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Enhanced Stats - Better Mobile Layout */}
          <FadeIn delay={0.8}>
            <div className="pt-12 sm:pt-16 lg:pt-20 border-t border-amber-600/30 max-w-4xl mx-auto">
              <p className="text-sm sm:text-base text-muted-foreground mb-8 sm:mb-10 opacity-90 font-medium">Trusted by creators worldwide</p>
              
              <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12 px-4">
                <div className="text-center group hover:scale-110 transition-all duration-300 touch-auto cursor-pointer">
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bebas text-warm-gradient mb-2 sm:mb-3 drop-shadow-lg">5,000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Creators</div>
                </div>
                
                <div className="text-center group hover:scale-110 transition-all duration-300 touch-auto cursor-pointer">
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-lg">1,500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">Projects</div>
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

export default Hero;
