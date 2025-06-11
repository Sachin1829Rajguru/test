import React from 'react'
import Hero from '../components/Hero'
import Featured from '../components/Featured'
import Exclusiveoffer from '../components/Exclusiveoffer'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import Recommended from '../components/Recommended'

function Home() {
  return (
    <>
      <Hero />
      <Recommended/>
      <Featured />
      <Exclusiveoffer/>
      <Testimonial/>
      <Newsletter/>
    </>
  )
}

export default Home
