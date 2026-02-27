import { ProjectIDView } from "@/app/features/CodeEditor/projectIDView";
import { Id } from "../../../../convex/_generated/dataModel";

const ProjectIdPage = async({
    params
}: {
    params: Promise<{projectId: string}>
}) => {

    const {projectId} = await params;
    return(
        
        <ProjectIDView projectId = {projectId as  Id<"projects">} />
    )
}

export default ProjectIdPage