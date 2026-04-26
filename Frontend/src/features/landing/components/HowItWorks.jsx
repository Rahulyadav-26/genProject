import React from 'react';
import { UploadCloud, FileSearch, TrendingUp } from 'lucide-react';
import styles from './HowItWorks.module.scss';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <UploadCloud size={32} />,
    title: '1. Upload Resume & JD',
    description: 'Simply upload your current resume and paste the job description for the role you want.'
  },
  {
    icon: <FileSearch size={32} />,
    title: '2. Deep AI Analysis',
    description: 'Our AI scans for missing keywords, identifies skill gaps, and scores ATS compatibility.'
  },
  {
    icon: <TrendingUp size={32} />,
    title: '3. Get Hired',
    description: 'Follow our personalized prep plan, practice mock interviews, and land the offer.'
  }
];

export default function HowItWorks() {
  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.grid}>
        {steps.map((step, idx) => (
          <motion.div 
            key={idx} 
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: idx * 0.2, duration: 0.5 }}
          >
            <div className={styles.iconBox}>{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
