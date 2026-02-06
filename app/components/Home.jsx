import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Layout, Calendar, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import CompanyCarousel from "./CompanyCrousel";
import WorkflowSection from "./WorkFlowSection";
import { motion } from "framer-motion";


const Home = () => {

 const features = [
        {
            title: "Intuitive Kanban Boards",
            description:
            "Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
            icon: Layout,
        },
        {
            title: "Powerful Sprint Planning",
            description:
            "Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
            icon: Calendar,
        },
        {
            title: "Comprehensive Reporting",
            description:
            "Gain insights into your team's performance with detailed, customizable reports and analytics.",
            icon: BarChart,
        },
    ];
    const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};



  return (
    <>
       <motion.section
            variants={container}
            initial="hidden"
            animate="visible"
            className="mx-auto text-center py-20 min-w-screen"
            >
            <motion.h1
                variants={item}
                className="text-5xl lg:text-7xl font-extrabold gradient-title pb-6 flex flex-col mx-auto"
            >
                Streamline Your Workflow
                <span className="gradient-title flex mx-auto gap-3 sm:gap-4 items-center">
                with{" "}
                <span className="text-[56px] lg:text-[80px] text-white">
                    Sprintly
                </span>
                </span>
            </motion.h1>

            <motion.div variants={item}>
                <p className="text-lg text-gray-300 m-2 px-4 mb-6 max-w-3xl mx-auto">
                Empower your team with our intuitive project management solution.
                </p>
            </motion.div>

            <motion.div
                variants={item}
                className="flex justify-center items-center gap-4 flex-wrap"
            >
                <Link href="/onboarding">
                <Button size="lg" className="text-md w-35 relative cursor-pointer">
                    Get Started
                    <ChevronRight
                    size={5}
                    width={43}
                    className="ml-1 mt-[0.5px] absolute left-5 svg"
                    />
                </Button>
                </Link>

                <Link href="#features">
                <Button
                    size="lg"
                    variant="outline"
                    className="px-[25px] py-[21px] text-md cursor-pointer"
                >
                    Learn More
                </Button>
                </Link>
            </motion.div>
        </motion.section>


        <section
            id="features"
            className="mx-auto text-center py-20 px-5 bg-[#0a0a0a]"
            >
            <div className="max-w-7xl mx-auto">
                <h3 className="text-3xl font-bold mb-12 text-white">
                Key features
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <Card
                    key={index}
                    className="bg-[#151515] border border-[#1F242B] rounded-xl"
                    >
                    <CardContent className="flex flex-col gap-4 p-6 text-left">
                        <feature.icon className="h-10 w-10 text-gray-200" />

                        <h4 className="text-lg font-semibold text-white">
                        {feature.title}
                        </h4>

                        <p className="text-sm text-gray-400 leading-relaxed">
                        {feature.description}
                        </p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
    </section>

    <WorkflowSection/>


       <section  className="mx-auto text-center py-20 lg:px-5">
            <div>
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Trusted by Industry Leaders
                </h3>
                <div className="lg:w-[94%] mx-auto lg:px-4">
                    <CompanyCarousel/>
                </div>
            </div>
        </section>

         <section  className="mx-auto text-center py-20 px-5  bg-[#0a0a0a]">
            <div>
                <h3 className="text-3xl font-bold mb-6 text-center">
                    Ready to Transform Your Workflow
                </h3>
                <p>Join thousands of teams already using Sprintly to streamline their projects and boost productivity</p>
                 <Link href="/onboarding">
                    <Button size="lg" className="text-md  mt-10 w-44 text-center relative cursor-pointer">
                        Start for Free<ChevronRight size={5} width={43} className="ml-1 mt-[0.5px] absolute  left-12 svg"></ChevronRight>
                    </Button>
                </Link>
            </div>
        </section>
        
    </>
    
  )
}
    
export default Home