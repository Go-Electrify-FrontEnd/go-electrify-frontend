"use client";

import { motion } from "framer-motion";

const carBrands = [
  { name: "Tesla", logo: "🔋" },
  { name: "VinFast", logo: "🚗" },
  { name: "BMW", logo: "🔷" },
  { name: "Mercedes", logo: "⭐" },
  { name: "Audi", logo: "⚡" },
  { name: "Hyundai", logo: "🔋" },
  { name: "Kia", logo: "⚡" },
  { name: "Nissan", logo: "🔋" },
  { name: "Volkswagen", logo: "⚡" },
  { name: "Porsche", logo: "🏎️" },
  { name: "Polestar", logo: "⭐" },
  { name: "Rivian", logo: "🔋" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LandingBrands() {
  return (
    <section className="bg-muted/30 border-t py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
            Hỗ trợ các thương hiệu xe điện
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {carBrands.map((brand, index) => (
            <motion.div
              key={index}
              variants={item}
              className="group hover:bg-accent/5 flex flex-col items-center justify-center gap-3 rounded-lg p-6 transition-all"
            >
              <div className="text-muted-foreground text-4xl opacity-60 transition-all group-hover:scale-110 group-hover:opacity-100">
                {brand.logo}
              </div>
              <div className="text-muted-foreground group-hover:text-foreground text-center text-sm font-medium transition-colors">
                {brand.name}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Và nhiều thương hiệu xe điện khác...
          </p>
        </motion.div>
      </div>
    </section>
  );
}
