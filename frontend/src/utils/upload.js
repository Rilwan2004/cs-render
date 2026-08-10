import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Takes a FileList/array of File objects, uploads them, returns an array of public URLs
export const uploadFiles = async (files, token) => {
    if (!files || files.length === 0) return [];
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data.urls;
};
