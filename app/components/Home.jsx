import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Layout, Calendar, BarChart } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import CompanyCarousel from "./CompanyCrousel";

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


  return (
    <>
        <section className=" mx-auto text-center py-20">
            <h1 className="text-6xl lg:text-7xl font-extrabold gradient-title pb-6 flex flex-col">Streamline Your Workflow
            <span className="gradient-title flex mx-auto gap-3 sm:gap-4 items-center">with{" "} <span className="text-[80px] text-white">Sprintly</span></span>
            </h1>

            <div>
                <p className="text-lg font- text-gray-300 mb-6 max-w-3xl mx-auto ">Empower your team with our intutive project management solution.</p>
                <Link href="/onboarding">
                    <Button size="lg" className="text-md  mt-4 w-35 text-center relative cursor-pointer">
                        Get Started<ChevronRight size={6} width={38} className="ml-1 mt-[0.5px] absolute  left-5 svg"></ChevronRight>
                    </Button>
                </Link>
                <Link href="#features">
                    <Button size="lg" variant="outline" className="mr-4 ml-5 px-[25px] py-[21px] text-md cursor-pointer">
                        Learn More
                    </Button>
                </Link>
            </div>
        </section>

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


       <section  className="mx-auto text-center py-20 px-5">
            <div>
                <h3 className="text-3xl font-bold mb-12 text-center">
                    Trusted by Industry Leaders
                </h3>
                <div className="w-[94%] mx-auto px-4">
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
                        Start for Free<ChevronRight size={6} width={38} className="ml-1 mt-[0.5px] absolute  left-12 svg"></ChevronRight>
                    </Button>
                </Link>
            </div>
        </section>
        
    </>
    
  )
}
    
export default Home