// eslint-disable-next-line no-unused-vars
import React from 'react'
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import Ratings from '../../components/Ratings'
import Services from '../../components/Services'
import WhyChooseUs from '../../components/WhyChooseUs'
import QuickConsult from '../../components/QuickConsult'
import Articles from '../../components/Articles'
import Chat from '../../components/Chat'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer'

function Home() {
  return (
    <div className='flex flex-col items-center w-full'>
      <Navbar />
      <Hero />
      <Ratings />
      <Services />
      <WhyChooseUs />
      <QuickConsult />
      <Articles />
      <Chat />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default Home
