import { useNavigate, useSearchParams } from "react-router-dom";

export type ParamValue = boolean | number | string | null | undefined;
export type QueryParams = Record<string, ParamValue>;

export interface UseNavigateWithParamsOptions {
  /**
   * If true, existing search parameters will not be preserved.
   * @default false
   */
  clearExisting?: boolean;
}

export const useNavigateWithParams = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const createQueryString = (
    newParams?: QueryParams,
    options?: UseNavigateWithParamsOptions,
  ): string => {
    const merged = options?.clearExisting
      ? new URLSearchParams()
      : new URLSearchParams(searchParams);

    if (newParams) {
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          merged.set(key, String(value));
        } else {
          merged.delete(key);
        }
      });
    }

    return merged.toString();
  };

  const push = (
    pathname: string,
    newParams?: QueryParams,
    options?: UseNavigateWithParamsOptions,
  ) => {
    const query = createQueryString(newParams, options);
    navigate(query ? `${pathname}?${query}` : pathname);
  };

  const replace = (
    pathname: string,
    newParams?: QueryParams,
    options?: UseNavigateWithParamsOptions,
  ) => {
    const query = createQueryString(newParams, options);
    navigate(query ? `${pathname}?${query}` : pathname, { replace: true });
  };

  return {
    push,
    pushWithParam: push,
    replace,
    replaceWithParam: replace,
    searchParams,
  };
};

export default useNavigateWithParams;
