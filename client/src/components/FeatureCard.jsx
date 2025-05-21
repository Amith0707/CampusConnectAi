import React from 'react';
import './FeatureCard.css';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="feature-card"
      initial={{opacity:0,y:50}}
      whileInView={{opacity:1,y:0}}
      transition={{duration:0.6,ease:'easeOut'}}
      viewport={{once:true}}>
      {/* <div className="feature-icon">{icon}</div> */}
      {/* <h3 className="feature-title">{title}</h3> */}
      {/* <p className="feature-desc">{description}</p> */}
        <div className='icon'>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
