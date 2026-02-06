import ProjectCard from "./ProjectCard"

const ProjectList = async ({ orgId }) => {
  const projects = await getProjects(orgId)

  if (projects.length === 0) {
    return (
      <>
        <h3>No Projects Found!!</h3>
        <Link
          href={`/project/create`}
          className="underline underline-offset-2 text-blue-200"
        >
          Create New
        </Link>
      </>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[92%] px-4 mx-auto">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export default ProjectList
