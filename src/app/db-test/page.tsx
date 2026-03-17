"use client";

export const dyanmic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function DbTestPage() {
  const [dbTime, setDbTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
  );

  async function handleCheckTime() {
    setLoading(true);
    try {
      // This calls an SQL function defined in supabase
      const { data, error } = await supabase.rpc("get_server_time");

      if (error) {
        setDbTime(`Error: ${error.message}`);
      } else {
        setDbTime(
          `Connection Successful! DB Time: ${new Date(data).toLocaleString()}`,
        );
      }
    } catch (err) {
      setDbTime(`Failed to connect to Supabase: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-900 text-white">
      <div className="z-10 w-full max-w-md items-center justify-between font-mono text-sm lg:flex flex-col gap-6 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold tracking-tight">
          PUP ACCESS-WEB DB Test
        </h1>
        <p className="text-slate-400">Testing Docker ↔ Supabase connection</p>

        <button
          onClick={handleCheckTime}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            loading
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95"
          }`}
        >
          {loading ? "Consulting DB..." : "Check DB Connection"}
        </button>

        {dbTime && (
          <div
            className={`mt-4 p-4 rounded-md w-full text-center ${
              dbTime.includes("Error")
                ? "bg-red-900/30 text-red-400 border border-red-800"
                : "bg-green-900/30 text-green-400 border border-green-800"
            }`}
          >
            <p className="text-xs uppercase tracking-widest font-bold mb-1">
              Result
            </p>
            <code className="text-sm">{dbTime}</code>
          </div>
        )}
      </div>
    </main>
  );
}
