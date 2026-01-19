"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  KanbanSquare,
  Users,
  Rocket,
} from "lucide-react";

const steps = [
  {
    title: "Plan",
    description:
      "Organize ideas into structured backlogs, sprints, and tasks with clear priorities.",
    icon: ClipboardList,
  },
  {
    title: "Track",
    description:
      "Visualize progress using Kanban-style boards with real-time status updates.",
    icon: KanbanSquare,
  },
  {
    title: "Collaborate",
    description:
      "Assign tasks, discuss work, and keep everyone aligned in one place.",
    icon: Users,
  },
  {
    title: "Deliver",
    description:
      "Complete sprints on time and ship with confidence using actionable insights.",
    icon: Rocket,
  },
];

export default function WorkflowSection() {
  return (
    <section className="relative py-18 bg-black overflow-hidden">
      {/* subtle grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff10_1px,transparent_0)] bg-[size:28px_28px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            From Backlog to Done
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            A simple, powerful workflow designed to help teams plan, execute,
            and deliver work faster.
          </p>
        </motion.div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="group bg-white/5 backdrop-blur border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition">
                      <Icon size={28} />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-semibold text-white">
            Ready to streamline your workflow?
          </h3>
          <p className="mt-2 text-gray-400">
            Create your first project in minutes.
          </p>

          <div className="mt-6 flex justify-center gap-4">
            <button className="px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition">
              Create Project →
            </button>
            <button className="px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition">
              Learn More
            </button>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
