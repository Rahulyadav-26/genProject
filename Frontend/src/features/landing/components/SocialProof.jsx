import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck2, Sparkles } from 'lucide-react';
import styles from './SocialProof.module.scss';

export default function SocialProof() {
  return (
    <div className={styles.wrapper}>
      <motion.div 
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.statItem}>
          <Users className={styles.icon} />
          <div className={styles.textContainer}>
            <h4>10k+</h4>
            <p>Resumes Analyzed</p>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.statItem}>
          <FileCheck2 className={styles.icon} />
          <div className={styles.textContainer}>
            <h4>87%</h4>
            <p>Interview Success Rate</p>
          </div>
        </div>

        <div className={styles.divider}></div>
        
        <div className={styles.statItem}>
          <Sparkles className={styles.icon} />
          <div className={styles.textContainer}>
            <h4>Instant</h4>
            <p>AI Feedback</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
