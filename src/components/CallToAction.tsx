
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const CallToAction = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/20 to-pink-900/20 animate-pulse-subtle"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-violet-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400 to-rose-600 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Sparkle Effects */}
      <div className="absolute top-32 left-32">
        <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-48 right-40">
        <Sparkles className="h-5 w-5 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-40 left-48">
        <Zap className="h-4 w-4 text-blue-400 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm border border-violet-300/30 mb-8 group hover:scale-105 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Join the Creative Revolution</span>
              <Sparkles className="h-4 w-4 text-violet-600 animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bebas font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ready to Create
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Something Extraordinary?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of visionary creators who are already transforming the world through collaboration. Your next masterpiece awaits.
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-xl px-12 py-6 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 group transform hover:scale-110 relative overflow-hidden"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <Sparkles className="mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Start Creating Magic
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </Link>
              
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-xl px-12 py-6 border-2 border-violet-300 dark:border-violet-700 bg-background/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-950/50 dark:hover:to-purple-950/50 hover:border-violet-400 transition-all duration-500 group transform hover:scale-105"
                >
                  Explore Projects
                  <Star className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/20 to-transparent h-px"></div>
              
              <div className="pt-12">
                <p className="text-sm text-muted-foreground mb-6 opacity-80">Trusted by creative minds worldwide</p>
                
                <div className="flex justify-center items-center space-x-12 opacity-70">
                  <div className="text-center group hover:opacity-100 transition-opacity duration-300">
                    <div className="text-3xl font-bebas bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">5,000+</div>
                    <div className="text-xs text-muted-foreground">Active Creators</div>
                  </div>
                  
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-violet-300 to-transparent"></div>
                  
                  <div className="text-center group hover:opacity-100 transition-opacity duration-300">
                    <div className="text-3xl font-bebas bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">1,500+</div>
                    <div className="text-xs text-muted-foreground">Projects Completed</div>
                  </div>
                  
                  <div className="w-px h-12 bg-gradient-to-b from-transparent via-violet-300 to-transparent"></div>
                  
                  <div className="text-center group hover:opacity-100 transition-opacity duration-300">
                    <div className="text-3xl font-bebas bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">100+</div>
                    <div className="text-xs text-muted-foreground">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CallToAction;
