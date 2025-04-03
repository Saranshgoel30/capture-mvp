import React from 'react';
import FadeIn from './ui-custom/FadeIn';
import { CheckCircle } from 'lucide-react';
const About: React.FC = () => {
  const advantages = ["Direct artist-to-artist connections without middlemen or gatekeepers", "Opportunities for emerging artists often overlooked by traditional channels", "Community support from fellow creators who understand your craft", "Local collaborations that strengthen your artistic community", "Creative freedom to pursue projects aligned with your artistic vision"];
  return <section id="about" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image/Illustration side */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                
              </div>
              
              {/* Stats card */}
              
            </div>
          </FadeIn>
          
          {/* Text content */}
          <div>
            <FadeIn>
              <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-3">
                Our Mission
              </span>
            </FadeIn>
            
            <FadeIn delay={100}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Empowering Artists Through Community
              </h2>
            </FadeIn>
            
            <FadeIn delay={200}>
              <p className="text-lg text-muted-foreground mb-6">
                We believe that every artist deserves a platform to showcase their talent and connect with opportunities. Capture was born out of frustration with how difficult it is for emerging creatives to find their community and collaborative projects.
              </p>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform is designed by artists, for artists. We've removed the gatekeepers and created a direct line between creative talent and the projects that need them, fostering a supportive ecosystem where artistic collaboration can thrive.
              </p>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="space-y-3 mb-8">
                {advantages.map((advantage, index) => <div key={index} className="flex items-start">
                    <CheckCircle className="text-primary mt-1 mr-3 h-5 w-5 flex-shrink-0" />
                    <span>{advantage}</span>
                  </div>)}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>;
};
export default About;