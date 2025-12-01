import API_BASE_URL from "../config/api-config";

interface LoginResponse {
    token: string;
}

export async function performLoginAsync(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log(errorData)
        const message = errorData?.message;
        if (message === 'This email is not registered'){
            throw new Error('Incorrect email address');
        }
        throw new Error('Incorrect password');
    }

    return response.json();
}