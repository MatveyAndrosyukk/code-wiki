import API_BASE_URL from "../config/api-config";

export async function deleteExtraImagesAsync(extraImages: string[]) {
    if (extraImages.length === 0) {
        return {deleted: 0};
    }

    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/images/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({delete_urls: extraImages}),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || 'Failed to delete images';
        throw new Error(message);
    }

    return await response.json();
}