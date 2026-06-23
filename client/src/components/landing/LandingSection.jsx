import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function LandingSection({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      variants={fadeUp}
      className={`mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default LandingSection;

