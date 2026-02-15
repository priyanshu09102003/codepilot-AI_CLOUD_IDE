
import { useEditor } from "@/hooks/use-editor";
import { Id } from "../../../../../convex/_generated/dataModel";
import { TopNavigation } from "./top-navigation";
import { FileBreadcrumbs } from "../file-breadcrumbs";
import { useFile, useUpdateFile } from "@/hooks/use-files";
import Image from "next/image";
import { CodeEditor } from "./code-editor";
import { useRef } from "react";

const DEBOUNCE_MS = 1500;

export const EditorView =({projectId}: {projectId: Id<"projects">})=>{

    const {activeTabId} = useEditor(projectId);
    const activeFile = useFile(activeTabId);

    const updateFile = useUpdateFile();
    const timeoutRef = useRef<NodeJS.Timeout|null>(null)

    

    const isActiveFileBinary = activeFile && activeFile.storageId;
    const isActiveFileText = activeFile && !activeFile.storageId


    return(

        <div className="h-full flex flex-col">
            <div className="flex items-center">

                <TopNavigation projectId={projectId} />

            </div>
            {activeTabId && <FileBreadcrumbs projectId={projectId} />}

            <div className="flex-1 min-h-0 bg-background">
                {
                    !activeFile && (
                        <div className="size-full items-center flex justify-center">

                            <Image
                            src="/logo-alt.svg"
                            alt="CodePilot"
                            width={50}
                            height={50}
                            className="opacity-55"
                            />

                        </div>
                    )
                }

                {
                    isActiveFileText && (
                        <CodeEditor 
                        fileName={activeFile.name} 
                        key={activeFile._id}
                        initialValue={activeFile.content}
                        onChange={(content: string) => {
                            if(timeoutRef.current){
                                clearTimeout(timeoutRef.current)
                            }

                            timeoutRef.current = setTimeout(() => {
                                updateFile({id: activeFile._id, content});
                            }, DEBOUNCE_MS)
                        }}
                        
                        />
                    )
                }

                {
                    isActiveFileBinary && (
                        <p>
                            Binary File
                        </p>
                    )
                }

            </div>

        </div>
    )

}