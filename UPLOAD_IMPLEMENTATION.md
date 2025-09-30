# Video & Image Upload Implementation

## Features Implemented

✅ **File Upload for Videos**: Users can now upload video files directly instead of entering URLs
✅ **File Upload for Thumbnails**: Support for both file upload and URL input for thumbnails  
✅ **Cloudinary Integration**: Videos and images are stored on Cloudinary CDN
✅ **Upload Progress**: Visual feedback during upload process
✅ **Video Preview**: Preview uploaded videos before saving
✅ **Form Validation**: Proper validation for required fields
✅ **Edit Video with File Upload**: Update existing videos with new files or just metadata

## API Endpoints

### Upload Endpoints
- `POST /api/upload/video` - Upload video files to Cloudinary
- `POST /api/upload/image` - Upload image files to Cloudinary

### Video Management
- `POST /api/admin/classes/[id]` - Add video to class (with file upload)
- `PUT /api/admin/classes/[id]/video/[videoId]` - Update video (supports both file upload and JSON)
- `DELETE /api/admin/classes/[id]/video/[videoId]` - Delete video

### PUT Video Endpoint Details
The PUT endpoint supports two types of requests:

#### 1. File Upload (FormData)
```javascript
const formData = new FormData();
formData.append("title", "New Video Title");
formData.append("file", videoFile);
formData.append("duration", "10");

fetch('/api/admin/classes/classId/video/videoId', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

#### 2. JSON Update (URL-based)
```javascript
fetch('/api/admin/classes/classId/video/videoId', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: "New Video Title",
    videoUrl: "https://example.com/video.mp4",
    duration: 10
  })
});
```

## Frontend Changes

### New Features in Course Form:
1. **Thumbnail Upload**: File input + URL fallback
2. **Video Upload**: File-based video upload with progress indication
3. **Real-time Preview**: Show uploaded videos/images immediately
4. **Upload Status**: Loading states for upload operations
5. **Edit Video Support**: Update existing videos with new files

### Form Structure:
```typescript
interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  file?: File; // New: for file upload
  duration: number;
  order: number;
}
```

### New API Functions:
```typescript
// Upload video file
uploadVideo(token: string, file: File)

// Upload image file  
uploadImage(token: string, file: File)

// Add video with file upload
addVideoToClass(token: string, classId: string, title: string, file: File, duration: number)

// Edit video with URL only
editVideo(token: string, classId: string, videoId: string, title: string, videoUrl: string, duration: number)

// Edit video with file upload
editVideoWithFile(token: string, classId: string, videoId: string, title: string, file: File, duration: number)
```

## Setup Instructions

### 1. Environment Variables
Create `.env.local` with:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Cloudinary Credentials
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to your `.env.local` file

### 3. Video Upload Flow
1. User selects video file from computer
2. File is uploaded to Cloudinary `/xcodeclass/videos/` folder
3. Cloudinary returns secure URL + video duration
4. Video data is saved to database with the URL

### 4. Image Upload Flow  
1. User selects image file or enters URL
2. If file selected, uploads to Cloudinary `/xcodeclass/thumbnails/`
3. Cloudinary auto-optimizes (800x600, quality: auto)
4. Thumbnail URL is saved to database

### 5. Edit Video Flow
1. User can edit video title, duration, or replace video file
2. If new file uploaded, old video remains in Cloudinary (can be cleaned up later)
3. If no new file, only metadata is updated
4. Supports both file upload and URL-based updates

## Usage

### Adding New Course with Videos:
1. Fill course details (title, description, price, mentor)
2. Upload thumbnail image or enter URL
3. Click "Add Video" 
4. Enter video title and duration
5. Select video file from computer
6. File uploads automatically to Cloudinary
7. Save course - all data including video URLs are stored

### Editing Existing Videos:
1. Use `editVideoWithFile()` for file replacement
2. Use `editVideo()` for metadata-only updates
3. PUT endpoint automatically detects request type (FormData vs JSON)

### Features:
- ✅ Multiple video uploads per course
- ✅ Progress indication during uploads
- ✅ Video preview before saving
- ✅ Remove videos from form
- ✅ Edit existing courses (videos can be added)
- ✅ Update existing videos with new files or metadata
- ✅ Automatic video ordering
- ✅ Flexible update methods (file upload or URL-based)

## File Structure
```
app/
├── api/
│   ├── upload/
│   │   ├── video/route.ts      # Video upload endpoint
│   │   └── image/route.ts      # Image upload endpoint
│   └── admin/classes/
│       ├── route.ts            # Create/list classes
│       ├── [id]/
│       │   └── route.ts        # Add videos, update class
│       └── [id]/video/[videoId]/
│           └── route.ts        # Update/delete specific video
├── admin/courses/
│   └── page.tsx               # Updated form with file uploads
utils/
├── api.ts                     # Updated API functions
lib/
└── cloudinary.ts             # Cloudinary configuration
```

## Benefits
1. **Better UX**: Direct file upload vs manual URL entry
2. **CDN Performance**: Fast global delivery via Cloudinary
3. **Auto Optimization**: Cloudinary auto-optimizes files
4. **Reliability**: No broken links from external URLs
5. **Storage Management**: Centralized file management
6. **Flexible Updates**: Support both file replacement and metadata-only updates

## Example Usage in Frontend

### Edit Video Component Example:
```typescript
const handleEditVideo = async (videoId: string, classId: string, data: {
  title: string;
  duration: number;
  file?: File;
}) => {
  const token = localStorage.getItem("token");
  
  if (data.file) {
    // Update with new file
    await editVideoWithFile(token, classId, videoId, data.title, data.file, data.duration);
  } else {
    // Update metadata only
    await editVideo(token, classId, videoId, data.title, existingVideoUrl, data.duration);
  }
};
```