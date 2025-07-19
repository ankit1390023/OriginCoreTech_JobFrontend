const API_BASE = import.meta.env.VITE_BASE_URL; // "http://localhost:5000/api"

export function getImageUrl(filePath) {
    // Replace backslashes with forward slashes
    let cleanPath = filePath.replace(/\\/g, "/");
    // Remove leading 'uploads/' if present
    cleanPath = cleanPath.replace(/^uploads\//, "");
    return `${API_BASE}/uploads/${cleanPath}`;
}

// Usage:
// const logoUrl = "uploads\\logos\\logo_4_1752931911539.jpg";
// const recruiterProfilePic = "uploads\\profilePics\\profile_4_1752931911551.png";
// getImageUrl(logoUrl);
// getImageUrl(recruiterProfilePic);

