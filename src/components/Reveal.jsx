import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

export default function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  distance = 24,
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance }}
      transition={{ duration: 0.6, delay, ease }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Component>
  );
}
