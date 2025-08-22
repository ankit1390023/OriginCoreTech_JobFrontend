const API_BASE = import.meta.env.VITE_BASE_URL; // "http://localhost:5000/api"

// Utility function to get image url
export function getImageUrl(filePath) {
  if (!filePath) return "/default-image.png";
  // Replace backslashes with forward slashes
  let cleanPath = filePath.replace(/\\/g, "/");
  // Remove leading 'uploads/' if present
  cleanPath = cleanPath.replace(/^uploads\//, "");
  return `${API_BASE}/uploads/${cleanPath}`;

  // Usage:
  // const logo_url = "uploads\\logos\\logo_4_1752931911539.jpg";
  // const recruiterProfilePic = "uploads\\profilePics\\profile_4_1752931911551.png";
  // getImageUrl(logo_url);
  // getImageUrl(recruiterProfilePic);
}

// Utility function to format dates
export const formatDate = (dateString) => {
  if (!dateString || dateString === "0000-00-00") return "Present";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  } catch (error) {
    return "Invalid Date";
  }
};

// Utility function to calculate time span
export const calculateTimeSpan = (start_date, end_date) => {
  if (!start_date || start_date === "0000-00-00")
    return "Duration not specified";

  try {
    const start = new Date(start_date);
    const end =
      end_date && end_date !== "0000-00-00" ? new Date(end_date) : new Date();

    const diffTime = Math.abs(end - start);
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
    );

    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? "s" : ""}${
        diffMonths > 0 ? ` ${diffMonths} month${diffMonths > 1 ? "s" : ""}` : ""
      }`;
    } else {
      return `${diffMonths} month${diffMonths > 1 ? "s" : ""}`;
    }
  } catch (error) {
    return "Duration not specified";
  }
};

// Format time ago
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} sec`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days`;
  return `${Math.floor(diffInSeconds / 2592000)} months`;
};

// Format number with k/m suffix
export const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
};
