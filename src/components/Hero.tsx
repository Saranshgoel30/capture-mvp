
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Briefcase, MessageCircle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeIn from '@/components/ui-custom/FadeIn';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-blue-900/20 to-purple-900/20 animate-pulse-subtle"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400 to-violet-600 rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full blur-3xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-emerald-400 to-teal-600 rounded-full blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Sparkle Effects */}
      <div className="absolute top-20 left-20">
        <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute top-40 right-32">
        <Star className="h-4 w-4 text-pink-400 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-32 left-40">
        <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30 mb-8 group hover:scale-105 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Where Creativity Meets Collaboration</span>
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bebas font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
                Create
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.3s' }}>
                Together
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.6s' }}>
              Connect with visionary creators, collaborate on groundbreaking projects, and bring your wildest creative dreams to life in a community that celebrates innovation.
            </p>
            
            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in" style={{ animationDelay: '0.9s' }}>
              <Link to="/projects">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 group transform hover:scale-105"
                >
                  <Sparkles className="mr-3 h-5 w-5 group-hover:animate-spin" />
                  Discover Magic
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-10 py-6 border-2 border-gradient bg-background/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:border-violet-300 transition-all duration-300 group transform hover:scale-105"
                >
                  Start Creating
                  <Star className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
              <FadeIn delay={0.2}>
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-200/20 hover:border-violet-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bebas text-2xl mb-3 text-foreground group-hover:text-violet-600 transition-colors">Connect with Visionaries</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Meet extraordinary creators who share your passion for innovation and excellence</p>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-200/20 hover:border-blue-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bebas text-2xl mb-3 text-foreground group-hover:text-blue-600 transition-colors">Join Epic Projects</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Dive into groundbreaking projects that challenge boundaries and create impact</p>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.6}>
                <div className="group p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-200/20 hover:border-emerald-400/40 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bebas text-2xl mb-3 text-foreground group-hover:text-emerald-600 transition-colors">Collaborate Seamlessly</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Experience effortless collaboration with tools designed for creative minds</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default Hero;
