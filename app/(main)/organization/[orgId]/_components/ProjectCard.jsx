"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteProject from "./DeleteProject"

const ProjectCard = ({ project }) => {
  const router = useRouter()

  return (
    <Card
      onClick={() => router.push(`/project/${project.id}`)}
      className="hover:shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-shadow duration-200 cursor-pointer"
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {project.name}
          <DeleteProject onClick={(e) => e.stopPropagation()} projectId={project.id} />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          {project.description}
        </p>
        <span className="text-blue-500 hover:underline">
          View Project
        </span>
      </CardContent>
    </Card>
  )
}

export default ProjectCard
