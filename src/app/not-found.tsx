import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found.</p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-primary hover:underline"
      >
        Back to home
      </Link>
    </div>
  );
}
