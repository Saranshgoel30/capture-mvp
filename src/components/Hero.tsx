
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 px-4 sm:px-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
      
      {/* Floating Elements - Hidden on mobile for performance */}
      <div className="absolute inset-0 hidden lg:block">
        <div className="absolute top-20 left-10 w-4 h-4 bg-amber-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-orange-400 rounded-full animate-pulse-subtle opacity-40"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-red-400 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-20 right-40 w-5 h-5 bg-yellow-400 rounded-full animate-pulse-subtle opacity-30"></div>
      </div>

      <div className="container mx-auto relative z-10 max-w-7xl">
        <div className="text-center space-y-6 sm:space-y-8 lg:space-y-12 py-12 sm:py-16 lg:py-20">
          {/* Badge - Mobile Optimized */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-warm text-xs sm:text-sm">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-amber-700">Creative Platform</span>
            </div>
          </FadeIn>

          {/* Main Headline - Mobile Optimized */}
          <FadeIn delay={0.2}>
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bebas font-bold leading-tight tracking-tight">
                <span className="block text-foreground mb-2 sm:mb-4">Where Creativity</span>
                <span className="block text-warm-gradient">Meets Collaboration</span>
              </h1>
              
              {/* Decorative underline */}
              <div className="flex justify-center">
                <div className="w-16 sm:w-24 lg:w-32 h-1 bg-warm-gradient rounded-full"></div>
              </div>
            </div>
          </FadeIn>

          {/* Subtitle - Mobile Optimized */}
          <FadeIn delay={0.4}>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
              Connect with visionary creators, discover extraordinary projects, and bring your most ambitious creative dreams to life through the power of collaboration.
            </p>
          </FadeIn>

          {/* CTA Buttons - Mobile First Design */}
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4 pt-4 sm:pt-8">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary min-h-[3rem] sm:min-h-[3.5rem]"
                >
                  <Sparkles className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-medium">Start Creating</span>
                  <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-4 sm:py-5 lg:py-6 border-2 border-amber-600/50 hover:border-amber-500 hover:bg-amber-900/30 transition-all duration-500 group min-h-[3rem] sm:min-h-[3.5rem]"
                >
                  <span className="font-medium">Explore Projects</span>
                  <Star className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Stats - Mobile Optimized */}
          <FadeIn delay={0.8}>
            <div className="pt-8 sm:pt-12 lg:pt-16 border-t border-amber-600/20 max-w-4xl mx-auto">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 opacity-80">Trusted by creators worldwide</p>
              
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas text-warm-gradient mb-1 sm:mb-2">5,000+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Creators</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">1,500+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Projects</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-1 sm:mb-2">100+</div>
                  <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Countries</div>
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
