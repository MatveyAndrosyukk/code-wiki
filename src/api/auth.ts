import API_BASE_URL from "../config/api-config";

interface LoginResponse {
    token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}