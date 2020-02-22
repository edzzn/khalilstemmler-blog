
import React from 'react'
import Line from '../../shared/line'
import prose from '../../../assets/prose'

const Hero = () => (
  <>
  <p className="intro-text">{prose.main.description}</p>
  <Line/>
  <br></br>
  <p>{ prose.main["description-expanded"] }</p>
  </>
)

export default Hero;

