import { ProjectIDView } from "@/app/features/CodeEditor/projectIDView";
import { Id } from "../../../../convex/_generated/dataModel";

const ProjectIdPage = async({
    params
}: {
    params: Promise<{projectId: Id<"projects">}>
}) => {

    const {projectId} = await params;
    return(
        
        <ProjectIDView projectId = {projectId} />
    )
}

export default ProjectIdPage