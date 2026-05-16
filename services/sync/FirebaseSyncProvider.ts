import type { ISyncProvider } from "./ISyncProvider";

/** Placeholder for future Firebase cloud backup implementation. */
export class FirebaseSyncProvider implements ISyncProvider {
  isEnabled(): boolean {
    return false;
  }

  async pull(): Promise<void> {
    throw new Error("Firebase sync not implemented");
  }

  async push(): Promise<void> {
    throw new Error("Firebase sync not implemented");
  }
}
