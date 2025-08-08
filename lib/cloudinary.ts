export const uploadToCloudinary = async (file: File, folder: string = 'freezing-point'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Only add upload_preset if it's configured
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
    }
    
    formData.append('folder', folder);

    // Determine resource type based on file type
    let resourceType = 'auto';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type === 'application/pdf') {
      resourceType = 'raw';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      reject(new Error('Cloudinary cloud name not configured'));
      return;
    }

    console.log('Uploading to Cloudinary:', {
      cloudName,
      uploadPreset,
      resourceType,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    });

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Cloudinary error response:', errorText);
          throw new Error(`Upload failed with status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Cloudinary upload response:', data);
        if (data.secure_url) {
          console.log('Upload successful:', data.secure_url);
          resolve(data.secure_url);
        } else if (data.url) {
          console.log('Upload successful (fallback URL):', data.url);
          resolve(data.url);
        } else {
          console.error('Upload response missing URL:', data);
          reject(new Error('Upload failed - no URL in response'));
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

    // Determine resource type based on file type
    let resourceType = 'auto';
    if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type === 'application/pdf') {
      resourceType = 'raw';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      reject(new Error('Cloudinary cloud name not configured'));
      return;
    }

    console.log('Simple upload to Cloudinary:', {
      cloudName,
      resourceType,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    });

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
    })
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Simple upload error response:', errorText);
          throw new Error(`Upload failed with status: ${response.status} - ${response.statusText}. Details: ${errorText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Simple upload response:', data);
        if (data.secure_url) {
          console.log('Simple upload successful:', data.secure_url);
          resolve(data.secure_url);
        } else if (data.url) {
          console.log('Simple upload successful (fallback URL):', data.url);
          resolve(data.url);
        } else {
          console.error('Simple upload response missing URL:', data);
          reject(new Error('Upload failed - no URL in response'));
        }
      })
      .catch(error => {
        console.error('Simple upload error:', error);
        reject(error);
      });
  });
};

// New method: Try multiple upload strategies
export const uploadToCloudinaryRobust = async (file: File, folder: string = 'freezing-point'): Promise<string> => {
  console.log('Starting robust upload for:', file.name);
  
  // Strategy 1: Try with upload preset
  try {
    console.log('Strategy 1: Upload with preset');
    return await uploadToCloudinary(file, folder);
  } catch (error) {
    console.log('Strategy 1 failed:', error);
  }
  
  // Strategy 2: Try simple upload without preset
  try {
    console.log('Strategy 2: Simple upload without preset');
    return await uploadToCloudinarySimple(file);
  } catch (error) {
    console.log('Strategy 2 failed:', error);
  }
  
  // Strategy 3: Try with different resource type
  try {
    console.log('Strategy 3: Upload with auto resource type');
    const formData = new FormData();
    formData.append('file', file);
    
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (uploadPreset) {
      formData.append('upload_preset', uploadPreset);
    }
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.secure_url || data.url) {
      console.log('Strategy 3 successful:', data.secure_url || data.url);
      return data.secure_url || data.url;
    } else {
      throw new Error('No URL in response');
    }
  } catch (error) {
    console.log('Strategy 3 failed:', error);
  }
  
  throw new Error('All upload strategies failed');
};

// Direct upload method - simplest possible approach
export const uploadToCloudinaryDirect = async (file: File): Promise<string> => {
  console.log('Direct upload attempt for:', file.name);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'freezing-point'); // Hardcoded for now
  
  const response = await fetch('https://api.cloudinary.com/v1_1/dik6zsyzz/auto/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Direct upload error:', errorText);
    throw new Error(`Direct upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Direct upload successful:', data.secure_url || data.url);
  return data.secure_url || data.url;
};
