import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesGrid from './components/ServicesGrid';
import NeuralVortex from './components/NeuralVortex';
import ProcessSteps from './components/ProcessSteps';
import Guarantee from './components/Guarantee';
import CTABand from './components/CTABand';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen relative font-sans antialiased text-text selection:bg-gold-dk selection:text-bg">
      {/* Background Layer */}
      <NeuralVortex theme={theme} />

      {/* Navigation Layer */}
      <Navbar />

      {/* Main Content Layer */}
      <main className="flex-grow pt-8 relative z-10 transition-colors duration-[300ms]">
        <Hero />
        
        <ServicesGrid />

        <ProcessSteps />

        <Guarantee />

        <CTABand />

        <Footer />
      </main>

      {/* Chatbot Layer */}
      <Chatbot />
    </div>
  );
}

export default App;
