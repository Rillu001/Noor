export interface ISyncProvider {
  pull(): Promise<void>;
  push(): Promise<void>;
  isEnabled(): boolean;
}
