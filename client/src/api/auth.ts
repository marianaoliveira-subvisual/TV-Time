import { apiFetch } from "./client";
import type { User } from "./types";

export function register(email: string, password: string, displayName: string) {
  return apiFetch<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, displayName }),
  });
}

export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe() {
  return apiFetch<{ user: User }>("/auth/me");
}
