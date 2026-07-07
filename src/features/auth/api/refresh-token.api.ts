// src/features/auth/api/refresh-token.api.ts
const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await fetch(`${baseUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};
