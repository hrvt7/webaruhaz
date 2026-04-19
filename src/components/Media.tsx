const VIDEO_RE = /\.(mp4|webm|mov|m4v)(\?|$)/i;

export function isVideo(url: string | null | undefined): boolean {
  return !!url && VIDEO_RE.test(url);
}

export function Media({
  src,
  poster,
  alt = "",
  className,
  fetchPriority,
}: {
  src: string;
  poster?: string;
  alt?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={poster}
        className={className}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={className} fetchPriority={fetchPriority} />;
}
