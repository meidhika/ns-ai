"use client";

import {
  Plus,
  FileText,
  ImageIcon,
  Code,
  Mic,
  Video,
  Paperclip,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AttachmentType } from "./ChatMessage";

interface ChatInputMenuProps {
  onUploadClick: () => void;
  onCreateImageClick: () => void;
  isCreateImageMode: boolean;
  onAddAttachment: (type: AttachmentType) => void;
  canAddCodeAudio: boolean;
  canAddCanvas: boolean;
  canAddVideo: boolean;
}

export default function ChatInputMenu({
  onUploadClick,
  onCreateImageClick,
  isCreateImageMode,
  onAddAttachment,
  canAddCodeAudio,
  canAddCanvas,
  canAddVideo,
}: ChatInputMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground shrink-0 mb-0.5"
        >
          <Plus size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={12}
        className="rounded-xl w-56 mb-2 p-2"
      >
        <DropdownMenuItem
          onClick={onUploadClick}
          className="gap-3 rounded-lg cursor-pointer py-2"
        >
          <div className="p-1.5 bg-primary/10 text-primary rounded-md">
            <FileText size={16} />
          </div>
          <span className="font-medium">Upload File</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onCreateImageClick}
          disabled={isCreateImageMode}
          className="gap-3 rounded-lg cursor-pointer py-2"
        >
          <div className="p-1.5 bg-secondary/20 text-secondary-foreground rounded-md">
            <ImageIcon size={16} />
          </div>
          <span className="font-medium">Create Image</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-3 rounded-lg cursor-pointer py-2">
            <div className="p-1.5 bg-accent/50 text-accent-foreground rounded-md">
              <Paperclip size={16} />
            </div>
            <span className="font-medium">Add Attachment</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent
              sideOffset={12}
              className="rounded-xl w-48 p-2 shadow-xl border-border"
            >
              <DropdownMenuItem
                disabled={!canAddCodeAudio}
                onClick={() => onAddAttachment("code")}
                className="gap-3 rounded-lg cursor-pointer py-2"
              >
                <Code size={16} className="text-muted-foreground" /> Code
                Snippet
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canAddCanvas}
                onClick={() => onAddAttachment("canvas")}
                className="gap-3 rounded-lg cursor-pointer py-2"
              >
                <ImageIcon size={16} className="text-muted-foreground" /> Canvas
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canAddCodeAudio}
                onClick={() => onAddAttachment("audio")}
                className="gap-3 rounded-lg cursor-pointer py-2"
              >
                <Mic size={16} className="text-muted-foreground" /> Audio /
                Voice
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!canAddVideo}
                onClick={() => onAddAttachment("video")}
                className="gap-3 rounded-lg cursor-pointer py-2"
              >
                <Video size={16} className="text-muted-foreground" /> Video /
                Camera
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
