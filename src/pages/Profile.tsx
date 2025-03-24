
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-8">PROFILE</h1>
          <p className="text-muted-foreground mb-12">
            Coming soon - This page will display your profile information, portfolio, and allow you to edit your details.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
