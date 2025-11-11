

// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// import streamifier from 'streamifier';  

// dotenv.config();

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Upload file to Cloudinary using streamifier
// export const uploadToCloudinary = (buffer, options = {}) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       options,
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
    
//     streamifier.createReadStream(buffer).pipe(uploadStream);
//   });
// };

// // Delete file from Cloudinary
// export const deleteFromCloudinary = async (publicId) => {
//   return cloudinary.uploader.destroy(publicId);
// };
// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure Cloudinary with validation
// if (!process.env.CLOUDINARY_CLOUD_NAME ||
//     !process.env.CLOUDINARY_API_KEY ||
//     !process.env.CLOUDINARY_API_SECRET) {
//   throw new Error('Missing Cloudinary configuration in environment variables');
// }

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true // Always use HTTPS
// });

// export const uploadToCloudinary = async (buffer, options = {}) => {
//   try {
//     // Convert buffer to data URI
//     const dataUri = `data:${options.resource_type === 'image' ? 'image/png' : 'application/octet-stream'};base64,${buffer.toString('base64')}`;
    
//     // Set default options
//     const uploadOptions = {
//       resource_type: 'auto', // Use 'auto' to let Cloudinary detect file type
//       ...options
//     };

//     console.log('Uploading to Cloudinary with options:', uploadOptions);
    
//     // Upload using data URI
//     const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
//     console.log('Cloudinary upload successful:', result);
//     return result;
//   } catch (error) {
//     console.error('Cloudinary upload error:', error);
//     throw new Error(`File upload failed: ${error.message}`);
//   }
// };

// export const deleteFromCloudinary = async (publicId, options = {}) => {
//   try {
//     // Determine resource type from options or default to 'raw'
//     const resourceType = options.resource_type || 'raw';
    
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: resourceType,
//       ...options
//     });
    
//     if (result.result !== 'ok') {
//       throw new Error(`Failed to delete file: ${result.result}`);
//     }
    
//     return result;
//   } catch (error) {
//     console.error('Cloudinary deletion error:', error);
//     throw new Error('File deletion failed');
//   }
// };

// /**
//  * Generate a secure URL for accessing the file
//  * @param {string} publicId - Cloudinary public ID
//  * @param {Object} options - URL generation options
//  * @returns {string} Secure URL
//  */
// export const generateSecureUrl = (publicId, options = {}) => {
//   // Determine resource type from options or default to 'auto'
//   const resourceType = options.resource_type || 'auto';
  
//   return cloudinary.url(publicId, {
//     resource_type: resourceType,
//     secure: true,
//     ...options
//   });
// };

// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure Cloudinary with validation
// if (!process.env.CLOUDINARY_CLOUD_NAME ||
//     !process.env.CLOUDINARY_API_KEY ||
//     !process.env.CLOUDINARY_API_SECRET) {
//   throw new Error('Missing Cloudinary configuration in environment variables');
// }

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true // Always use HTTPS
// });

// /**
//  * Enhanced file upload with proper MIME type detection
//  */
// export const uploadToCloudinary = async (buffer, options = {}) => {
//   try {
//     // Detect file type from buffer or options
//     const fileType = options.resource_type || 
//                     (options.contentType ? options.contentType.split('/')[0] : 'auto');
    
//     // Set appropriate MIME type
//     let mimeType;
//     switch (fileType) {
//       case 'image': mimeType = 'image/png'; break;
//       case 'pdf': mimeType = 'application/pdf'; break;
//       case 'raw': mimeType = 'application/octet-stream'; break;
//       default: mimeType = 'application/octet-stream';
//     }

//     const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;
    
//     const uploadOptions = {
//       resource_type: fileType === 'auto' ? 'auto' : fileType,
//       ...options
//     };

//     const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
//     return result;
//   } catch (error) {
//     console.error('Upload error:', error);
//     throw new Error(`Upload failed: ${error.message}`);
//   }
// };

// /**
//  * Enhanced file deletion
//  */
// export const deleteFromCloudinary = async (publicId, options = {}) => {
//   try {
//     const result = await cloudinary.uploader.destroy(publicId, {
//       resource_type: options.resource_type || 'raw',
//       ...options
//     });
    
//     if (result.result !== 'ok') {
//       throw new Error(`Deletion failed: ${result.result}`);
//     }
    
//     return result;
//   } catch (error) {
//     console.error('Deletion error:', error);
//     throw new Error('File deletion failed');
//   }
// };

// /**
//  * Generate download URL with proper file handling
//  */
// export const generateDownloadUrl = (publicId, options = {}) => {
//   const resourceType = options.resource_type || 'raw';
  
//   return cloudinary.url(publicId, {
//     resource_type: resourceType,
//     secure: true,
//     flags: 'attachment', // Force download
//     ...options
//   });
// };

// /**
//  * Express endpoint for secure file downloads
//  */
export const downloadFileHandler = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resource_type, filename } = req.query;

    // Generate secure download URL
    const downloadUrl = generateDownloadUrl(publicId, {
      resource_type: resource_type || 'raw',
      filename: filename || 'file',
    });

    // Set proper headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
    
    // Redirect to Cloudinary's secure URL
    res.redirect(307, downloadUrl);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      error: 'Download failed',
      message: error.message 
    });
  }
};

/**
 * Alternative: Direct download proxy (for private files)
 */
export const proxyDownloadHandler = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { resource_type } = req.query;

    // Get the file URL
    const fileUrl = cloudinary.url(publicId, {
      resource_type: resource_type || 'raw',
      secure: true
    });

    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Cloudinary responded with ${response.status}`);
    }

    // Set proper headers
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Disposition', `attachment; filename="${publicId.split('/').pop()}"`);

    // Stream the file
    response.body.pipe(res);
    
  } catch (error) {
    console.error('Proxy download error:', error);
    res.status(500).json({ 
      error: 'Download failed',
      message: error.message 
    });
  }
};

import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// export const uploadToCloudinary = (buffer, options = {}) => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       options,
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };

// export const uploadToCloudinary = (buffer, options = {}) => {
//   // Set default options for PDF uploads
//   const pdfOptions = {
//     resource_type: "auto",  // or explicitly "raw"
//     format: "pdf",
//     access_mode: "public",
//     ...options
//   };

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       pdfOptions,
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );
    
//     uploadStream.end(buffer);
//   });
// };

// Alternative approach using base64 encoding
export const uploadToCloudinary = async (buffer, originalFilename) => {
  return new Promise((resolve, reject) => {
    // Convert buffer to base64
    const base64Data = buffer.toString('base64');
    
    const uploadOptions = {
      resource_type: "auto",
      public_id: `submissions/${Date.now()}`,
      format: "pdf",
      type: "upload",
      content_type: "application/pdf"
    };
    
    // Upload with data URI
    cloudinary.uploader.upload(
      `data:application/pdf;base64,${base64Data}`,
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
};
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};