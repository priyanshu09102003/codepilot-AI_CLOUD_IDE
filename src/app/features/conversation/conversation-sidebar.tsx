import { Id } from "../../../../convex/_generated/dataModel";
import ky from "ky";
import { toast } from "sonner";
import { useState } from "react";
import { 
  CopyIcon, 
  HistoryIcon, 
  LoaderIcon, 
  PlusIcon
} from "lucide-react";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { Button } from "@/components/ui/button";
import { useConversation, useAllConversations, useCreateConversation, useMessages } from "@/hooks/use-conversations";
import { DEFAULT_CONVERSATION_TITLE } from "../../../../convex/constants";




interface ConversationSidebarProps{
    projectId: Id<"projects">
}

export const ConversationSidebar = ({
    projectId,
}: ConversationSidebarProps) => {


    return(

        <div className="flex flex-col h-full bg-sidebar">
            <div className="h-8.75 flex items-center justify-between border-b">

                <div className="text-sm truncate pl-3">
                    {DEFAULT_CONVERSATION_TITLE}
                </div>

                <div className="flex items-center px-1 gap-1">

                    <Button
                    size={"icon-xs"}
                    variant={"highlight"}
                    >
                        <HistoryIcon className="size-3.5" />
                    </Button>

                    <Button
                    size={"icon-xs"}
                    variant={"highlight"}
                    >
                        <PlusIcon className="size-3.5" />
                    </Button>

                </div>

            </div>

            <Conversation className="flex-1">

                <ConversationContent>
                    <p>Messages</p>
                </ConversationContent>


            </Conversation>
        </div>
    )
}