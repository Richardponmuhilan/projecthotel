// src/hooks/useTimeslots.js
import { useCallback, useEffect, useRef, useState } from "react";
import  { fetchTimeslots,invalidateTimeslotCache } from "../services/services.js";

/**
 * useTimeslots - load timeslot array from the shared service
 * returns { timeslots, loading, error, refresh }
 */
export function useTimeslots({ auto = true } = {}) {
  const [timeslots, setTimeslots] = useState(null);
  const [loading, setLoading] = useState(Boolean(auto));
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const load = useCallback(async ({ force = false } = {}) => {
    // abort any pending
    if (controllerRef.current) controllerRef.current.abort();
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      const arr = await fetchTimeslots({ signal: ctrl.signal, force });
      setTimeslots(arr);
      return arr;
    } catch (err) {
      if (err.name === "AbortError") {
        // aborted - ignore
      } else {
        setError(err.message || "Failed to load timeslots");
        throw err;
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!auto) return;
    load().catch(() => {});
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [auto, load]);

  const refresh = useCallback(async (opts = {}) => {
    // force ignore cache and optionally return fetched array
    invalidateTimeslotCache();
    return load({ force: true, ...opts });
  }, [load]);

  const abort = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
  }, []);

  return { timeslots, loading, error, refresh, abort, reload: refresh };
}
