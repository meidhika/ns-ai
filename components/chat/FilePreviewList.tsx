"use client";

import { X, File as FileIcon } from "lucide-react";

export interface UploadedFile {
  file: File;
  previewUrl: string | null;
}

interface FilePreviewListProps {
  files: UploadedFile[];
  onRemove: (index: number) => void;
}

export default function FilePreviewList({
  files,
  onRemove,
}: FilePreviewListProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 px-3 pt-2 pb-1">
      {files.map((uf, idx) => (
        <div
          key={idx}
          className="relative group flex items-center gap-2 bg-background border border-border rounded-xl p-1.5 pr-3 shadow-sm animate-in zoom-in-95"
        >
          <button
            onClick={() => onRemove(idx)}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
          >
            <X size={12} />
          </button>

          {uf.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={uf.previewUrl}
              alt="preview"
              className="w-8 h-8 object-cover rounded-md bg-muted"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center rounded-md">
              <FileIcon size={16} />
            </div>
          )}
          <span className="text-xs font-medium max-w-[120px] truncate text-foreground">
            {uf.file.name}
          </span>
        </div>
      ))}
    </div>
  );
}
