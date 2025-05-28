
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center max-w-4xl mx-auto">
            {/* Visual indicator */}
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-primary/20 backdrop-blur-sm">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bebas font-bold mb-6 text-foreground">
              Ready to Create Something Amazing?
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already collaborating and bringing their visions to life.
            </p>
            
            {/* Primary CTA - Following Fitts Law (large target) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/projects">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-4 border-2 hover:bg-background/50 transition-all duration-300"
                >
                  Explore Projects
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-4">Trusted by creators worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="text-2xl font-bebas">1000+ Projects</div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="text-2xl font-bebas">500+ Creators</div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="text-2xl font-bebas">50+ Cities</div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CallToAction;
