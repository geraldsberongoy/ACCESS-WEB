import Image from "next/image";

function isPdfUrl(url: string): boolean {
  return /\.pdf($|[?#])/i.test(url);
}

type OfficersRosterMediaProps = {
  url: string;
  alt?: string;
  className?: string;
  frameClassName?: string;
};

export default function OfficersRosterMedia({
  url,
  alt = "Current ACCESS officers",
  className = "h-auto w-full object-contain",
  frameClassName = "h-[min(80vh,900px)] w-full rounded-2xl border-0 bg-white",
}: OfficersRosterMediaProps) {
  if (isPdfUrl(url)) {
    return <iframe src={url} title={alt} className={frameClassName} />;
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={1400}
      height={900}
      className={className}
      unoptimized={url.startsWith("http")}
    />
  );
}
