import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Utility function to upload file to Cloudinary
export const uploadToCloudinary = async(file, folder) => {
    try {
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(file, {
            folder: `hackmatrix/${folder}`,
            // Optional: Add transformation or other upload options
            // transformation: [{ width: 500, height: 500, crop: 'limit' }]
        });

        return {
            public_id: result.public_id,
            url: result.secure_url
        };
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw new Error('File upload failed');
    }
};

// Utility function to delete file from Cloudinary
export const deleteFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary Delete Error:', error);
        throw new Error('File deletion failed');
    }
};

export default cloudinary;