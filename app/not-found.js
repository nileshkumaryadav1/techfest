import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[color:var(--background)] text-[color:var(--foreground)] px-6">
      <div className="text-center space-y-4 max-w-lg">
        <img src="/logo.png" alt="404" className="w-48 h-48 mx-auto" />
        <h1 className="text-6xl font-bold text-[color:var(--accent)]">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-[color:var(--secondary)] text-base">
          Sorry, the page you&apso;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[color:var(--accent)] text-[color:var(--background)] px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Go to Home
        </Link>
      </div>
    </main>
  );
}
