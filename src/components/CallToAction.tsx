
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const CallToAction = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-amber-950/30 to-background">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="text-center space-y-16">
          {/* Main CTA Content */}
          <FadeIn>
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-warm">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-300">Join the Creative Revolution</span>
              </div>
              
              {/* Headline */}
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-bold leading-tight tracking-tight">
                  <span className="block text-foreground">Ready to Create</span>
                  <span className="block text-warm-gradient">
                    Something Extraordinary?
                  </span>
                </h2>
                
                {/* Decorative element */}
                <div className="flex justify-center">
                  <div className="w-40 h-1 bg-warm-gradient rounded-full"></div>
                </div>
              </div>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                Join thousands of visionary creators who are already transforming the world through collaboration. Your next masterpiece awaits.
              </p>
            </div>
          </FadeIn>
          
          {/* Action Buttons */}
          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-xl px-12 py-6 bg-warm-gradient hover:shadow-warm text-white shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden btn-primary"
                >
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Start Creating Magic
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-xl px-12 py-6 border-2 border-amber-600/50 hover:border-amber-500 hover:bg-amber-900/30 transition-all duration-500 group"
                >
                  Explore Projects
                  <Star className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </FadeIn>
          
          {/* Trust Indicators with Better Layout */}
          <FadeIn delay={0.4}>
            <div className="pt-16 border-t border-amber-600/20">
              <p className="text-sm text-muted-foreground mb-8 opacity-80">Trusted by creative minds worldwide</p>
              
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bebas text-warm-gradient mb-2">5,000+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Active Creators</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bebas bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-2">1,500+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Projects Completed</div>
                </div>
                
                <div className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl font-bebas bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">100+</div>
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
