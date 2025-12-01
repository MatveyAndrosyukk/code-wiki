import API_BASE_URL from "../config/api-config";

export async function uploadImageAsync(file: File): Promise<{fileName: string}> {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/images`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData,
    })

    if (!response.ok) {
        throw new Error(`Upload error: ${response.statusText}`);
    }

    return await response.json();
}