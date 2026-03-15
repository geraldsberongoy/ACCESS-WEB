import Navbar from "@/components/ui/Navbar";
export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to ACCESS
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Landing page
        </p>
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} ACCESS
      </footer>
    </div>
  );
}
