import { useRouter, useSearch } from "@tanstack/react-router";

export const useSearchParams = <T extends Record<string, any>>(
  ignoreBlocker = false
) => {
  const router = useRouter();
  const search = useSearch({ strict: false });

  const setSearchParams = (params: Partial<T>, replace: boolean = true) => {
    router.navigate({
      to: ".",
      search: (prev: any) => ({
        ...prev,
        ...params,
      }),
      ignoreBlocker,
      replace,
    });
  };

  const removeSearchParams = (keys: (keyof T)[], replace: boolean = true) => {
    router.navigate({
      to: ".",
      search: (prev: any) => {
        const updatedParams = { ...prev };
        keys.forEach((key) => delete updatedParams[key]);
        return updatedParams;
      },
      ignoreBlocker,
      replace,
    });
  };

  const getSearchParams = (): T => {
    return search;
  };

  return { setSearchParams, removeSearchParams, getSearchParams };
};
