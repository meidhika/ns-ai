"use client";

export default function VideoAttachment({
  src,
  mode,
}: {
  src?: string;
  mode: "input" | "view";
}) {
  return (
    <div
      className={`rounded-xl overflow-hidden border border-border shadow-sm bg-black ${mode === "input" ? "w-64" : "w-full max-w-md"}`}
    >
      <video controls className="w-full">
        <source src={src || "dummy.mp4"} type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}
