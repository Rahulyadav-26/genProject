import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import styles from './ResumeMockup.module.scss';

export default function ResumeMockup() {
  return (
    <div className={styles.mockupContainer}>
      <motion.div 
        className={styles.glassCard}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className={styles.header}>
          <div className={styles.avatar}></div>
          <div className={styles.headerText}>
            <div className={styles.line1}></div>
            <div className={styles.line2}></div>
          </div>
        </div>

        <div className={styles.bodySection}>
          <div className={styles.sectionTitle}></div>
          <div className={styles.pLine}></div>
          <div className={styles.pLine}></div>
          <div className={styles.pLineShort}></div>
        </div>
        
        <div className={styles.bodySection}>
          <div className={styles.sectionTitle}></div>
          <div className={styles.pLine}></div>
          <div className={styles.pLineShort}></div>
        </div>

        {/* Floating Highlight 1 */}
        <motion.div 
          className={`${styles.highlight} ${styles.highlightTeal}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <CheckCircle2 size={14} className={styles.icon} /> React.js Keyword Match
        </motion.div>

        {/* Floating Highlight 2 */}
        <motion.div 
          className={`${styles.highlight} ${styles.highlightAmber}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <CheckCircle2 size={14} className={styles.icon} /> System Design Gap
        </motion.div>
        
        {/* Floating Badge */}
        <motion.div
           className={styles.atsBadge}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1.5, duration: 0.5 }}
        >
          Predicted ATS: <strong>92%</strong>
        </motion.div>

      </motion.div>
    </div>
  );
}
