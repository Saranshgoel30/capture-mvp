
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen-mobile flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 px-4 sm:px-6 safe-area-inset-top safe-area-inset-bottom">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 sm:opacity-30"></div>
      
      {/* Floating Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 hidden xl:block">
        <div className="absolute top-20 left-10 w-4 h-4 bg-amber-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-orange-400 rounded-full animate-pulse-subtle opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-red-400 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-5 h-5 bg-yellow-400 rounded-full animate-pulse-subtle opacity-30"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12 py-8 sm:py-12 lg:py-16">
          {/* Badge - Mobile Optimized */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full glass-warm text-sm touch-auto">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-amber-700">Creative Platform</span>
            </div>
          </FadeIn>

          {/* Main Headline - Mobile Optimized */}
          <FadeIn delay={0.2}>
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bebas font-bold leading-[0.9] tracking-tight px-2">
                <span className="block text-foreground mb-2 sm:mb-3">Where Creativity</span>
                <span className="block text-warm-gradient">Meets Collaboration</span>
              </h1>
              
              {/* Decorative underline */}
              <div className="flex justify-center">
                <div className="w-20 sm:w-28 lg:w-36 h-1.5 bg-warm-gradient rounded-full"></div>
              </div>
            </div>
          </FadeIn>

          {/* Subtitle - Mobile Optimized */}
          <FadeIn delay={0.4}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
              Connect with visionary creators, discover extraordinary projects, and bring your most ambitious creative dreams to life through the power of collaboration.
            </p>
          </FadeIn>

          {/* CTA Buttons - Mobile First Design */}
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 pt-6 sm:pt-8">
              <Link to="/signup" className="w-full sm:w-auto max-w-sm">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-10 lg:px-12 py-6 sm:py-7 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary min-h-[56px] touch-auto"
                >
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-semibold">Start Creating</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects" className="w-full sm:w-auto max-w-sm">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg sm:text-xl px-8 sm:px-10 lg:px-12 py-6 sm:py-7 border-2 border-amber-600/50 hover:border-amber-500 hover:bg-amber-900/30 transition-all duration-500 group min-h-[56px] touch-auto"
                >
                  <span className="font-semibold">Explore Projects</span>
                  <Star className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Stats - Mobile Optimized */}
          <FadeIn delay={0.8}>
            <div className="pt-12 sm:pt-16 lg:pt-20 border-t border-amber-600/20 max-w-4xl mx-auto">
              <p className="text-sm text-muted-foreground mb-6 sm:mb-8 opacity-80">Trusted by creators worldwide</p>
              
              <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                <div className="text-center group hover:scale-105 transition-transform duration-300 touch-auto">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bebas text-warm-gradient mb-2">5,000+</div>
                  <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Creators</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300 touch-auto">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">1,500+</div>
                  <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Projects</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300 touch-auto">
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">100+</div>
                  <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">Countries</div>
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
