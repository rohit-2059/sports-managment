"use client";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import avatar1 from './Screenshot 2025-12-21 004008.png';
import avatar2 from './Screenshot 2025-12-21 004016.png';
import avatar3 from './Screenshot 2025-12-21 004029.png';
import avatar4 from './Screenshot 2025-12-21 004048.png';
const defaultTestimonials = [
  {
    text: "SportsPro has completely transformed how I manage my team. Everything I need in one place - scheduling, stats, and communication.",
    imageSrc: avatar2,
    name: "Rohit Khandelwal",
    username: "@rohit_sports",
    role: "High School Basketball Coach",
  },
  {
    text: "Managing multiple teams was a nightmare before SportsPro. Now I can track everything easily and focus on what matters - coaching.",
    imageSrc: avatar1,
    name: "Ananya",
    username: "@ananya_coach",
    role: "Soccer Club Director",
  },
  {
    text: "The tournament management feature is incredible. We ran our entire regional tournament smoothly with real-time updates.",
    imageSrc: avatar3,
    name: "Anjali",
    username: "@anjali_sports",
    role: "Tournament Organizer",
  },
  {
    text: "As a player, I love seeing my stats and knowing when practices are. My parents get updates too which is super convenient.",
    imageSrc: avatar4,
    name: "Yash Watts",
    username: "@yashwatts",
    role: "Varsity Volleyball Player",
  },
  {
    text: "SportsPro helped us professionalize our youth league. Automated scheduling saved me hours every week.",
    imageSrc: avatar1,
    name: "Vaibhav",
    username: "@vaibhav_sports",
    role: "League Administrator",
  },
  {
    text: "The analytics dashboard gives me insights I never had before. I can see which drills work best for each player.",
    imageSrc: avatar4,
    name: "Niladri Mandal",
    username: "@niladri_coach",
    role: "Track & Field Coach",
  },
  {
    text: "Managing player statistics has never been easier. SportsPro's interface is intuitive and powerful.",
    imageSrc: avatar2,
    name: "Mohit Khandelwal",
    username: "@mohit_manages",
    role: "Cricket Team Manager",
  },
  {
    text: "The scheduling feature is a game-changer. No more conflicts or confusion about practice times.",
    imageSrc: avatar3,
    name: "Mayank Bansal",
    username: "@mayank_sports",
    role: "Football Coach",
  },
  {
    text: "SportsPro made organizing our inter-school tournament so much easier. Highly recommend it!",
    imageSrc: avatar4,
    name: "Yash Bansal",
    username: "@yash_organizer",
    role: "Sports Coordinator",
  },
];
export default function TestimonialsCarousel({
  testimonials = defaultTestimonials,
  title = "Loved by Coaches & Players",
  subtitle = "From youth leagues to professional organizations, SportsPro is trusted by thousands of coaches, players, and administrators worldwide.",
  autoplaySpeed = 3000,
  className,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplaySpeed);
    return () => {
      clearInterval(autoplay);
    };
  }, [emblaApi, autoplaySpeed]);
  const allTestimonials = [...testimonials, ...testimonials];
  return (
    <section
      id="testimonials"
      className={cn("relative overflow-hidden py-16 md:py-24", className)}>
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.2),transparent_60%)]" />
        <div className="bg-primary/5 absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative mb-12 text-center md:mb-16">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <motion.p
            className="text-gray-300 mx-auto max-w-2xl text-base md:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}>
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Testimonials carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {allTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className="flex justify-center px-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="border-border from-secondary/20 to-card relative h-full w-fit rounded-2xl border bg-gradient-to-b p-6 shadow-md backdrop-blur-sm">
                  {/* Enhanced decorative gradients */}
                  <div className="from-primary/15 to-card absolute -top-5 -left-5 -z-10 h-40 w-40 rounded-full bg-gradient-to-b blur-md" />
                  <div className="from-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-gradient-to-t to-transparent opacity-70 blur-xl" />

                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-primary mb-4">
                    <div className="relative">
                      <Quote className="h-10 w-10 -rotate-180" />
                    </div>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="text-foreground/90 relative mb-6 text-base leading-relaxed">
                    <span className="relative">{testimonial.text}</span>
                  </motion.p>

                  {/* Enhanced user info with animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="border-border/40 mt-auto flex items-center gap-3 border-t pt-2">
                    <Avatar className="border-border ring-primary/10 ring-offset-background h-10 w-10 border ring-2 ring-offset-1">
                      <AvatarImage
                        src={testimonial.imageSrc}
                        alt={testimonial.name}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-foreground font-medium whitespace-nowrap">
                        {testimonial.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-primary/80 text-sm whitespace-nowrap">
                          {testimonial.username}
                        </p>
                        {testimonial.role && (
                          <>
                            <span className="text-muted-foreground flex-shrink-0">
                              •
                            </span>
                            <p className="text-muted-foreground text-sm whitespace-nowrap">
                              {testimonial.role}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}