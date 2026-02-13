"use client"

import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { UserButton } from "@clerk/nextjs";
import { useSingleProject } from "@/hooks/use-projects";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

export const Navbar = ({
    projectId
}:{
    projectId: Id<"projects">
}) => {


    const project = useSingleProject(projectId)

    return(
        <nav className="flex justify-between items-center gap-x-2 p-2 p-2 bg-sidebar border-b">
            <div className="flex items-center gap-x-2">

                <Breadcrumb>

                    <BreadcrumbList className="gap-0!">

                        <BreadcrumbItem>

                            <BreadcrumbLink className="flex items-center gap-1.5" asChild> 

                                <Button variant={"ghost"} className="w-fit! p-1.5! h-9!" asChild>

                                    <Link href="/">

                                        <Image 
                                        src="/logo.svg"
                                        alt="CodePilot"
                                        width={25}
                                        height={25}
                                        />

                                        <span className={cn(
                                            "font-bold tracking-tight bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent",
                                            font.className
                                        )}>
                                            CodePilot
                                        </span>
                                    
                                    </Link>



                                </Button>
                            
                            </BreadcrumbLink>
                        
                        
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="ml-0! mr-1" /> 
                        <BreadcrumbItem>

                                <BreadcrumbPage className="cursor-pointer hover:text-primary font-medium max-w-40 truncate">

                                        {project?.name ?? "Loading..."}
                                
                                </BreadcrumbPage>
                        
                        </BreadcrumbItem>

                    </BreadcrumbList>
                
                
                </Breadcrumb>


            </div>

            <div className="flex items-center gap-2">

                <UserButton />

            </div>

        </nav>
    )

}