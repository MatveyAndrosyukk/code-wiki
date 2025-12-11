import API_BASE_URL from "../config/api-config";

interface BanUserDto {
    email: string;
    banReason: string;
}

export async function banUserByReasonAsync(dto: BanUserDto) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/users/ban`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message
        throw new Error(message);
    }

    return;
}