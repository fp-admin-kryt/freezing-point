export const uploadToCloudinary = async (file: File, folder: string = 'freezing-point'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'freezing-point');
    formData.append('folder', folder);

    // Add additional parameters for better compatibility
    formData.append('resource_type', 'auto');
    formData.append('access_mode', 'public');

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      reject(new Error('Cloudinary cloud name not configured'));
      return;
    }

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.secure_url) {
          console.log('Upload successful:', data.secure_url);
          resolve(data.secure_url);
        } else {
          console.error('Upload response:', data);
          reject(new Error('Upload failed - no secure_url in response'));
        }
      })
      .catch(error => {
        console.error('Upload error:', error);
        reject(error);
      });
  });
};

// Fallback method without preset (for testing)
export const uploadToCloudinarySimple = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      reject(new Error('Cloudinary cloud name not configured'));
      return;
    }

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Upload failed with status: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.secure_url) {
          console.log('Simple upload successful:', data.secure_url);
          resolve(data.secure_url);
        } else {
          console.error('Simple upload response:', data);
          reject(new Error('Upload failed - no secure_url in response'));
        }
      })
      .catch(error => {
        console.error('Simple upload error:', error);
        reject(error);
      });
  });
};
