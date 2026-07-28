import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SETTINGS, getWebsiteSettings } from "@/lib/admin/settings";
import type { WebsiteSettingsInput } from "@/lib/admin/types";

export const WEBSITE_SETTINGS_QUERY_KEY = ["website-settings"] as const;

/**
 * Reads the live Website Settings document, with DEFAULT_SETTINGS as
 * `placeholderData` so the very first render (and any offline/error case)
 * already matches the site's original hardcoded content exactly — there is
 * no loading flash and no risk of blank/empty values ever reaching the DOM.
 */
export function useWebsiteSettings() {
  const query = useQuery({
    queryKey: WEBSITE_SETTINGS_QUERY_KEY,
    queryFn: getWebsiteSettings,
    staleTime: 5 * 60 * 1000,
    placeholderData: { ...DEFAULT_SETTINGS, updatedAt: null, updatedBy: null },
  });

  // query.data is never undefined thanks to placeholderData, but keep the
  // return type simple and always-defined for callers.
  const settings: WebsiteSettingsInput = query.data ?? DEFAULT_SETTINGS;

  return { settings, isLoading: query.isLoading, isError: query.isError };
}
