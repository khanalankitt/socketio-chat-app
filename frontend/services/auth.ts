interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function register(registerPayload: RegisterData) {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("Error while registering: ", error);
  }
}

export async function login(loginPayload: LoginData) {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginPayload),
    });
    return await res.json();
  } catch (error) {
    console.error("Error while logging in: ", error);
  }
}

export async function logout() {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return await res.json();
  } catch (error) {
    console.error("Error while logging out: ", error);
  }
}
