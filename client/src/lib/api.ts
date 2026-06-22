import type {
  GeocodePlaceResponse,
  GetReportResponse,
  MatchReport,
  MatchRequest,
  SaveReportResponse,
} from "../../../shared/src";

// const API_URL = import.meta.env.VITE_API_URL;
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      /* ignore */
    }
    throw new ApiError(message, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  geocode: (q: string) =>
    request<GeocodePlaceResponse>(`/geocode?q=${encodeURIComponent(q)}`),

  computeMatch: (body: MatchRequest) =>
    request<MatchReport>("/match", { method: "POST", body: JSON.stringify(body) }),

  saveReport: (body: MatchRequest) =>
    request<SaveReportResponse>("/reports", { method: "POST", body: JSON.stringify(body) }),

  getReport: (id: number, token: string) =>
    request<GetReportResponse>(`/reports/${id}?t=${encodeURIComponent(token)}`),

  deleteReport: (id: number, token: string) =>
    request<void>(`/reports/${id}?t=${encodeURIComponent(token)}`, { method: "DELETE" }),
};

export { ApiError };
