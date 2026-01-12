import { getProject } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import SprintCreation from "../_components/SprintCreation";
import SpringBoard from "../_components/SpringBoard";

const ProjectPage = async ({ params }) => {
  const { projectid } =await params;

  const project = await getProject(projectid);

  if (!project) {
    notFound();
  }

  return (
    <div>
      {/* Sprint Creation  */}
      <div className="mt-6">
        <SprintCreation
          projectId={projectid}
          projectTitle={project.name}
          projectKey={project.key}
          sprintKey={(project.sprints?.length ?? 0) + 1}
        />
      </div>
      
      {/* {/* Sprint Board */}
      {project.sprints?.length > 0 ? (
        <SpringBoard
          sprints={project.sprints}
          projectId={projectid}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}

      
    </div>
  );
};

export default ProjectPage;
