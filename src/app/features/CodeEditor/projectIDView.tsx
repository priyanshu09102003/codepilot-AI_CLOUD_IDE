"use client";

import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";

const Tab = ({
    label,
    isActive,
    onClick
} : {
    label: string;
    isActive: boolean;
    onClick: () => void;

})=>{

    return(
        <div
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground border-r hover:bg-accent/30",
            isActive && "bg-background text-foreground"
        )}
        >
            <span className="text-sm">
                {label}
            </span>
        </div>
    )

}

export const ProjectIDView = (
    {projectId}:
    {projectId: Id<"projects">

    })=>{

        return(

            <div className="h-full flex flex-col">
                <nav className="h-8.75 flex items-center bg-sidebar/80 border-b">
                    <Tab 
                    label="Code"
                    isActive={false}
                    onClick={() => {}}
                    />
                    <Tab 
                    label="Preview"
                    isActive={false}
                    onClick={() => {}}
                    />
                </nav>
            </div>
        )

        

}