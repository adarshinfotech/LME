import Link from "next/link";

export default function ApplicationNotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="font-display text-display-sm">Application not found</h1>
      <p className="mt-3 text-muted">It may have been removed, or the link is incorrect.</p>
      <Link href="/admin" className="mt-8 inline-block text-sm underline underline-offset-4">
        Back to all applications
      </Link>
    </div>
  );
}
