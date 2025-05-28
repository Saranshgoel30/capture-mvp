
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline - Following Miller's Law (7±2 words) */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bebas font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Find Creative Partners
            </h1>
            
            {/* Subheadline - Clear value proposition */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Connect with talented creators for film, music, and digital projects. Build your next masterpiece together.
            </p>
            
            {/* Primary Actions - Following Hicks Law (limited choices) */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/projects">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  Browse Projects
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 py-4 border-2 hover:bg-accent/10 transition-all duration-300"
                >
                  Start Creating
                </Button>
              </Link>
            </div>
            
            {/* Visual indicators - Following Gestalt's Law (grouped elements) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bebas text-xl mb-2">Find Creators</h3>
                  <p className="text-muted-foreground text-sm">Discover talented filmmakers, musicians, and digital artists</p>
                </div>
              </div>
              
              <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bebas text-xl mb-2">Join Projects</h3>
                  <p className="text-muted-foreground text-sm">Apply to exciting creative projects that match your skills</p>
                </div>
              </div>
              
              <div className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bebas text-xl mb-2">Collaborate</h3>
                  <p className="text-muted-foreground text-sm">Build meaningful connections and create amazing work</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
