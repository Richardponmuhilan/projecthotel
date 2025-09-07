const BASE_URL = "http://localhost:4000/api";

let cache = {
  key: null,
  data: null,
  ts: 0,
  ttl: 10_000,
};

export async function fetchTimeslots(opts = {}) {
  const { signal, force = false, date } = opts;
  const key = date || "ALL";
  const now = Date.now();

  if (!force && cache.data && cache.key === key && now - cache.ts < cache.ttl) {
    return cache.data;
  }

  const url = new URL(`${BASE_URL}/getTimeslot`);
  if (date) url.searchParams.set("date", date);

  const res = await fetch(url.toString(), { signal });
  if (!res.ok) throw new Error(`Failed to fetch timeslots (${res.status})`);
  const json = await res.json();

  // <-- NEW: handle response shaped like { gettimeslot: [...] }
  let arr = [];
  if (Array.isArray(json)) {
    arr = json;
  } else if (json && Array.isArray(json.gettimeslot)) {
    arr = json.gettimeslot;
  } else if (json && Array.isArray(json.getTimeslot)) {
    // defensive: other possible key
    arr = json.getTimeslot;
  } else {
    arr = [];
  }

  cache = { key, data: arr, ts: Date.now(), ttl: cache.ttl };
  return arr;
}

export function invalidateTimeslotCache() {
  cache = { key: null, data: null, ts: 0, ttl: cache.ttl };
}