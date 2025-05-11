import { z } from "zod";
import axios, { AxiosError } from "axios";

export const baseURL: string = new URL(import.meta.env.VITE_MAGIC_BASE_URL!, import.meta.url).href;

export const numberDateParser = z.number().refine(v => !isNaN(new Date(v).getTime()), {
  message: "Invalid timestamp",
});

export const api = axios.create({ baseURL, responseType: "json", withCredentials: true });

export function isCaptchaRequired(error: AxiosError) {
  if (error.response) {
    const { status, data } = error.response;

    return status == 429 && data && typeof data == "object" && "error" in data && data.error == "CAPTCHA_REQUIRED";
  }

  return false;
}

// // Add an interceptor to handle specific API errors
// api.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   async (error: AxiosError) => {
//     if (error.response) {
//       const { status, data } = error.response;

//       switch (status) {
//         case 401:
//           throw new Error("You must be logged in to access this resource.");
//         case 403:
//           if (data && typeof data == "object" && "error" in data && data.error == "CAPTCHA_REQUIRED") {
//             throw new Error("Suspicious activity detected. Please complete the CAPTCHA.");
//           } else {
//             throw new Error("You do not have permission to perform this action.");
//           }
//         default:
//           throw new Error(data?.message || "An unexpected error occurred.");
//       }
//     }

//     // Handle network or other unexpected errors
//     throw new Error("Network error or server is unreachable.");
//   }
// );
