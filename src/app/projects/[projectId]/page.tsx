const ProjectIdPage = async({
    params
}: {
    params: Promise<{projectId: string}>
}) => {

    const {projectId} = await params;
    return(
        <div>
            Building IDE
        </div>
    )
}

export default ProjectIdPage