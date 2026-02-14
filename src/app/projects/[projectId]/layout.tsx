import { ProjectIdLayout } from "@/app/features/projects/projectId-layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Id } from "../../../../convex/_generated/dataModel";

const Layout = async({
    children,
    params
}:{
    children: React.ReactNode;
    params: Promise<{projectId: Id<"projects">}> 
}) => {
    const {projectId} = await params;


    return(
        <TooltipProvider>
            <ProjectIdLayout projectId={projectId}>
                {children}
            </ProjectIdLayout>
        </TooltipProvider>
    )
}

export default Layout;