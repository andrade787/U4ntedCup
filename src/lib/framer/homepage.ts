export const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
    },
  }),
};

export const CampeonatosBackground = {
  hidden: { backgroundPosition: '0% 50%' },
  visible: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};


