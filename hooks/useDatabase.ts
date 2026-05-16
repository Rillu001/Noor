import { useEffect, useState } from "react";
import { getDatabase } from "../database/client";
import { runMigrations } from "../database/migrations";
import { useAppStore } from "../store/useAppStore";

export function useDatabase() {
  const [error, setError] = useState<Error | null>(null);
  const setDbReady = useAppStore((s) => s.setDbReady);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const db = await getDatabase();
        await runMigrations(db);
        if (mounted) {
          setDbReady(true);
        }
      } catch (e) {
        if (mounted) {
          setError(e instanceof Error ? e : new Error("Database init failed"));
        }
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, [setDbReady]);

  return { error };
}
