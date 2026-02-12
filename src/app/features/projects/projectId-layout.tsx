"use client";

export const ProjectIdLayout = ({
    children,
    projectId
}: {
    children: React.ReactNode;
    projectId: string;

}) => {

    return(
        <div className="w-full h-screen flex flex-col">
            <Navabar projectId = {projectId} />
            {children}
        </div>
    )

}