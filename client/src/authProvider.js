import { useState, useEffect, useLayoutEffect } from "react";
import api from "./API";
const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(); // access token

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/api/me");
        setToken(response.data.accessToken);
      } catch (error) {
        setToken(null);
      }
    };

    fetchMe();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 403 &&
          error.response?.data?.message === "Unauthorized"
        ) {
          try {
            const response = await api.get("/api/refreshToken");
            setToken(response.data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;
            return api(originalRequest);
          } catch {
            setToken(null);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, [token]);
};
