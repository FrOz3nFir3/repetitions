import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page container">
      <header className="hero-section text-center">
        <h1>Welcome to Repetitions.tech</h1>
        <p>The smart way to learn and retain knowledge.</p>
        <Link to="/home">
          <button className="btn bg-blue-france">Get Started</button>
        </Link>
      </header>

      <section className="why-section">
        <h2 className="text-center">Why Repetitions.tech?</h2>
        <p>
          Repetitions.tech is a modern learning platform that uses the power of spaced repetition to help you remember concepts for longer. Our system is designed to optimize your study sessions by showing you the right flashcards at the right time, just before you're about to forget them.
        </p>
      </section>

      <section className="benefits-section">
        <h2 className="text-center">Benefits</h2>
        <div className="grid-three-columns">
          <div className="benefit-card">
            <h3>Efficient Learning</h3>
            <p>Master your subjects in less time by focusing on what you're about to forget.</p>
          </div>
          <div className="benefit-card">
            <h3>Long-Term Retention</h3>
            <p>Move beyond cramming and build a lasting foundation of knowledge.</p>
          </div>
          <div className="benefit-card">
            <h3>Personalized Reviews</h3>
            <p>Our algorithm adapts to your learning pace and personalizes your review schedule.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="text-center">How It Works</h2>
        <div className="grid-three-columns">
          <div className="step-card">
            <h3>1. Create</h3>
            <p>Create your own flashcards or use our pre-made decks on various subjects.</p>
          </div>
          <div className="step-card">
            <h3>2. Review</h3>
            <p>Review your flashcards daily. Our system will tell you what to study.</p>
          </div>
          <div className="step-card">
            <h3>3. Retain</h3>
            <p>Watch as you retain more information with less effort. Track your progress and see how much you've learned.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
