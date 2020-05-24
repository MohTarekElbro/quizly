import React from 'react';
import Navbar from './Header'
import Header from './Navbar'
import Features from './Features'
import Reviews from './Reviews'
import Contact from './Contact'
import Footer from './Footer'

function Home() {
  return (
    <div>
      <Navbar />
      <Header />
      <Features />
      <Reviews />
      <Contact />
      <Footer />

    </div>
  );
}

export default Home;
