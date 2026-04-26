import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router'; 
import styles from './Hero.module.scss';

const taglines = ['Get Hired Faster', 'Beat the ATS', 'Ace Your Interview'];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.heroContainer}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }} 
        className={styles.badge}
      >
        <span className={styles.sparkle}>✨</span> ResumeIQ Next-Gen AI
      </motion.div>

      <h1 className={styles.headline}>
        The Smart Way to <br />
        <span className={styles.animatedTextWrapper}>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "anticipate" }}
              className={styles.dynamicText}
            >
              {taglines[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className={styles.subheadline}
      >
        Upload your resume. Paste the job description. Our AI highlights gaps, predicts ATS scores, and generates a personalized prep plan to secure your dream offer.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.5, duration: 0.6 }}
        className={styles.ctaGroup}
      >
        <button onClick={() => navigate('/register')} className={styles.primaryCta}>
          <span className={styles.ctaText}>Optimize My Resume</span>
          <ArrowRight size={18} className={styles.arrow} />
          <div className={styles.shimmerEffect}></div>
        </button>
        <div className={styles.trustIndicator}>
          Join 25,000+ ambitious job seekers
        </div>
      </motion.div>
    </div>
  );
}
