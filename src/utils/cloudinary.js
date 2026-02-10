/**
 * Upload an image file to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */

const cloudname = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", preset);

  try {
    console.log('being called.')
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudname}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    return data.secure_url; // Returns HTTPS URL

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

/**
 * Get an optimized version of a Cloudinary image URL
 * @param {string} url - Original Cloudinary URL
 * @param {number} width - Desired width in pixels
 * @returns {string} - Optimized URL
 */
// export const getOptimizedImageUrl = (url, width = 800) => {

//   if (!url || !url.includes("cloudinary.com")) return url;

//   // Insert transformations into URL
//   // w_ = width, f_auto = auto format, q_auto = auto quality
//   return url.replace("/upload/", `/upload/w_${width},f_auto,q_auto/`);
// };

/**
 * Validate image file before upload
 * @param {File} file - File to validate
 * @returns {Object} - { valid: boolean, error: string|null }
 */
// export const validateImageFile = (file) => {
//   const maxSize = 5 * 1024 * 1024; // 5MB
//   const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

//   if (!file) {
//     return { valid: false, error: "No file selected" };
//   }

//   if (!allowedTypes.includes(file.type)) {
//     return {
//       valid: false,
//       error: "Please select a valid image file (JPG, PNG, WebP, or GIF)",
//     };
//   }

//   if (file.size > maxSize) {
//     return { valid: false, error: "Image size must be less than 5MB" };
//   }

//   return { valid: true, error: null };
// };
