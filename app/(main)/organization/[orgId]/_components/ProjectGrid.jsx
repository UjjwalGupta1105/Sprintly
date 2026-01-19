import { getProjects } from "@/app/actions/projects";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import DeleteProject from "./DeleteProject";
import { FolderKanban } from "lucide-react";

const ProjectGrid = async ({ orgId }) => {
  const projects = await getProjects(orgId);

  return (
    <>
      <h2 className="text-4xl font-semibold gradient-title mb-6">
        Projects
      </h2>

      {projects.length === 0 ? (
        <div className="text-gray-400">
          No projects yet.{" "}
          <Link
            href="/project/create"
            className="text-blue-400 underline"
          >
            Create one
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group bg-white/5 border border-white/10 backdrop-blur hover:border-blue-500/40 transition"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <FolderKanban size={18} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {project.name}
                    </h3>
                  </div>

                  <DeleteProject projectId={project.id} />
                </div>

                <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                  {project.description || "No description provided"}
                </p>

                <Link
                  href={`/project/${project.id}`}
                  className="inline-block mt-5 text-sm text-blue-400 hover:underline"
                >
                  Open Project →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectGrid;
