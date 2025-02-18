"use server";
import { headers } from "next/headers";

/**
 * This method returns the server URL based on the request headers.
 */
export const baseUrl = () => {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
};
