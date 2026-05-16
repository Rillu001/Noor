import { useAppStore } from "../store/useAppStore";
import { toDateKey } from "../utils/dates";

export function useToday() {
  const selectedDate = useAppStore((s) => s.selectedDate);
  return selectedDate || toDateKey();
}
