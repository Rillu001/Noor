import type { ISyncProvider } from "./ISyncProvider";

export class NoOpSyncProvider implements ISyncProvider {
  isEnabled(): boolean {
    return false;
  }

  async pull(): Promise<void> {
    // Future: Firebase / Supabase sync
  }

  async push(): Promise<void> {
    // Future: Firebase / Supabase sync
  }
}
