"use client";

import { create } from "zustand";
import { apiFetch } from "../lib/api";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  async login(payload) {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch("/auth/login", { method: "POST", body: payload });
      window.localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  async signup(payload) {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch("/auth/signup", { method: "POST", body: payload });
      window.localStorage.setItem("token", data.token);
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  logout() {
    window.localStorage.removeItem("token");
    set({ user: null, token: null });
  }
}));
