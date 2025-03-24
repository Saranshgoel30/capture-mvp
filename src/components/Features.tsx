
import React from 'react';
import { Users, Camera, Sparkles, Megaphone, Globe, Heart } from 'lucide-react';
import FadeIn from './ui-custom/FadeIn';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <FadeIn delay={delay} direction="up">
      <div className="h-full group p-6 rounded-xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all-300">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-all-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </FadeIn>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Users size={24} />,
      title: "Artist Community",
      description: "Connect with like-minded creatives who share your passion and vision for collaborative art."
    },
    {
      icon: <Camera size={24} />,
      title: "Showcase Your Work",
      description: "Build a portfolio that truly represents your artistic vision and creative capabilities."
    },
    {
      icon: <Sparkles size={24} />,
      title: "Creative Collaborations",
      description: "Find the perfect collaborators to bring your artistic vision to life, no matter how ambitious."
    },
    {
      icon: <Megaphone size={24} />,
      title: "Visibility Without Gatekeepers",
      description: "Get your work seen by those who matter without traditional industry barriers."
    },
    {
      icon: <Globe size={24} />,
      title: "Local & Global Reach",
      description: "Connect with artists in your community or collaborate across borders on international projects."
    },
    {
      icon: <Heart size={24} />,
      title: "Supportive Network",
      description: "Build relationships with artists who understand your journey and can help you grow."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 md:px-12 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
              For Creators
            </span>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Community Artists Deserve
            </h2>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're breaking down the barriers that keep creative talent isolated and projects understaffed. Capture connects artists directly to opportunities and to each other.
            </p>
          </FadeIn>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={100 * (index + 1)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
