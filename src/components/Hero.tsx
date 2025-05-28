
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, MessageCircle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Rustic Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-yellow-900/20"></div>
      
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-amber-600/30 rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 border border-orange-600/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-yellow-600/20 rounded-full"></div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen py-20">
          {/* Left Column - Content */}
          <div className="space-y-12">
            <FadeIn>
              {/* Premium Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-warm group hover:shadow-warm transition-all duration-300">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-amber-300">Where Creativity Meets Collaboration</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              {/* Main Headline with Better Typography */}
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bebas font-bold leading-[0.9] tracking-tight">
                  <span className="block text-warm-gradient">
                    Create
                  </span>
                  <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                    Together
                  </span>
                </h1>
                
                {/* Decorative Line */}
                <div className="w-24 h-1 bg-warm-gradient rounded-full"></div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4}>
              {/* Refined Subheadline */}
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
                Connect with visionary creators, collaborate on groundbreaking projects, and bring your wildest creative dreams to life in a community that celebrates innovation.
              </p>
            </FadeIn>
            
            <FadeIn delay={0.6}>
              {/* Refined Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/projects">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-4 bg-warm-gradient hover:shadow-warm text-white shadow-xl hover:shadow-2xl transition-all duration-300 group btn-primary"
                  >
                    <Sparkles className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Discover Magic
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-4 border-2 border-amber-600/50 hover:border-amber-500 hover:bg-amber-900/30 transition-all duration-300 group"
                  >
                    Start Creating
                    <Star className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
          
          {/* Right Column - Feature Preview Cards */}
          <div className="relative">
            <FadeIn delay={0.8}>
              <div className="grid grid-cols-1 gap-6">
                {/* Card 1 - Elevated */}
                <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="p-8 rounded-2xl glass-warm shadow-warm hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Connect with Visionaries</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Meet extraordinary creators who share your passion for innovation</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card 2 - Centered */}
                <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-500 ml-8">
                  <div className="p-8 rounded-2xl glass-warm shadow-warm hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-600 to-red-700 shadow-lg">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Join Epic Projects</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Dive into groundbreaking projects that challenge boundaries</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card 3 - Lower */}
                <div className="relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="p-8 rounded-2xl glass-warm shadow-warm hover:shadow-3xl transition-all duration-500 group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-700 shadow-lg">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bebas text-xl mb-2 text-foreground">Collaborate Seamlessly</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">Experience effortless collaboration with creative tools</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-2 border-amber-600/40 rounded-full opacity-60"></div>
            <div className="absolute -bottom-8 -right-6 w-12 h-12 border-2 border-orange-600/40 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-full opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
