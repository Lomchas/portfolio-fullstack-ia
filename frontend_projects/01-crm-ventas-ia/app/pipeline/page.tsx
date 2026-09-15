import Link from "next/link";

export default function PipelineAlias() {
  return (
    <div className="p-8">
      <p className="text-sm text-slate-400">
        El pipeline vive en{" "}
        <Link href="/" className="text-sky-300 underline">
          / (home)
        </Link>{" "}
        para acceso rápido.
      </p>
    </div>
  );
}
