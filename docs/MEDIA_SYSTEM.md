# Centralized Media System Architecture

## Overview

The media system has been completely refactored into a **single, centralized solution** that acts as the single source of truth for all uploaded assets across the CMS/blog platform.

### Key Principles

✅ **Upload Once, Use Anywhere** - Media uploaded from any component is available globally  
✅ **Consistent API** - All uploads go through the same unified endpoint  
✅ **Database Tracking** - All media is tracked in MongoDB with metadata  
✅ **Usage References** - System tracks where and how each media file is used  
✅ **Reusable Assets** - Media can be selected and reused across different modules  

---

## Architecture

### Core Components

#### 1. **Media Model** (`lib/models/Media.ts`)

Database schema for tracking all media with metadata:

```typescript
{
  filename: string;                    // Unique identifier
  originalName: string;                // Human-readable name
  mimeType: string;                    // Content type
  size: number;                        // File size in bytes
  dimensions: { width, height };       // Image dimensions
  
  storagePath: string;                 // Path relative to project root
  publicUrl: string;                   // Served at /blogs/Media/...
  
  usedBy: [{                          // Track where media is used
    type: string;                      // Reference ID (blog ID, etc.)
    field: string;                     // Field name (thumbnail, etc.)
    module: string;                    // Module (blog, page, etc.)
  }];
  
  uploadedBy: string;                  // Admin username
  uploadedAt: Date;                    // Upload timestamp
  isDeleted: boolean;                  // Soft-delete flag
}
```

#### 2. **Media Service** (`lib/media.ts`)

Centralized business logic for all media operations:

```typescript
uploadMedia(file, options)     // Upload new file with metadata
getAllMedia(filter, limit)     // Fetch media with pagination
getMediaByFilename(filename)   // Retrieve specific media
deleteMedia(filename)          // Hard/soft delete
searchMedia(query)             // Search by filename or tags
trackMediaUsage(filename)      // Track where media is used
removeMediaUsage(filename)     // Remove usage reference
```

#### 3. **Media API** (`app/api/admin/media/route.ts`)

Unified REST endpoints:

- **GET** `/api/admin/media` - List all media with pagination/search
- **POST** `/api/admin/media` - Upload new file
- **DELETE** `/api/admin/media` - Delete file

#### 4. **Media Page** (`app/admin/media/page.tsx`)

Enhanced UI with:

- Grid and List view modes
- Search/filter functionality
- Metadata display (size, upload date, usage count)
- Quick actions (open, copy URL, delete)
- Usage tracking

---

## Upload Flow

### System-Wide Upload Process

Every upload, regardless of source, follows this path:

```
User Action (Blog Editor, Media Page, etc.)
    ↓
FormData + File + Usage Info
    ↓
POST /api/admin/media
    ↓
Media Service:
  ├─ Generate unique filename
  ├─ Write file to public/blogs/Media/
  ├─ Store metadata in MongoDB
  ├─ Track usage (if provided)
  └─ Return public URL
    ↓
Response: { ok: true, path, file }
    ↓
Component stores returned URL or metadata
```

### Usage Tracking

When uploading with usage context:

```javascript
// Example: Blog thumbnail upload
const fd = new FormData();
fd.append('file', file);
fd.append('usedBy', JSON.stringify({
  type: 'blog-id-123',        // Which blog this is for
  field: 'thumbnail',         // Which field
  module: 'blog'              // Which module
}));

POST /api/admin/media → Database tracks this relationship
```

---

## Blog Editor Integration

### Thumbnail Upload

The blog editor now uses the centralized system:

```typescript
// Upload new thumbnail
async function handleUploadThumbnail(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('usedBy', JSON.stringify({
    type: form._id || 'new-blog',
    field: 'thumbnail',
    module: 'blog'
  }));
  
  const res = await fetch('/api/admin/media', { 
    method: 'POST', 
    body: fd 
  });
  
  const json = await res.json();
  if (json.ok) {
    updateField('thumbnail', json.path);  // Store the URL
  }
}
```

### Media Selection Modal

Two-tab interface:

1. **Upload New** - Drag & drop to upload directly
2. **From Gallery** - Browse and select existing media

```
Content
├─ Upload Tab
│  └─ File upload → POST /api/admin/media
├─ Gallery Tab
│  ├─ GET /api/admin/media (load all)
│  └─ Click to select
```

---

## Media Library Page

### Features

- **Centralized View**: Shows all uploaded media globally
- **Multiple Views**: Grid (visual) or List (detailed)
- **Search**: Filter by filename, tags
- **Metadata**: File size, upload date, usage count
- **Quick Actions**:
  - Open in new tab
  - Copy URL to clipboard
  - Delete file
  - View usage references

### URL Structure

All media accessible at: `/blogs/Media/{encoded-filename}`

Example:
```
/blogs/Media/1715366400000-a1b2c3d4.jpg
```

---

## API Endpoints

### GET /api/admin/media

**Query Parameters:**
- `q`: Search query (optional)
- `limit`: Results per page (default: 100, max: 200)
- `skip`: Pagination offset (default: 0)

**Response:**
```json
{
  "ok": true,
  "items": [
    {
      "_id": "...",
      "filename": "...",
      "originalName": "image.jpg",
      "publicUrl": "/blogs/Media/...",
      "size": 125000,
      "uploadedAt": "2026-05-10T...",
      "usedBy": [
        {
          "type": "blog-id",
          "field": "thumbnail",
          "module": "blog"
        }
      ]
    }
  ],
  "total": 42
}
```

### POST /api/admin/media

**Form Data:**
- `file`: File to upload
- `usedBy`: (Optional) JSON with `{ type, field, module }`

**Response:**
```json
{
  "ok": true,
  "file": { ... metadata ... },
  "path": "/blogs/Media/..."
}
```

### DELETE /api/admin/media

**Request Body:**
```json
{
  "filename": "1715366400000-a1b2c3d4.jpg"
}
```

**Response:**
```json
{
  "ok": true
}
```

---

## Extensibility

### Adding New Upload Sources

To support uploads from new modules (e.g., pages, social posts):

1. Import media service:
```typescript
import { uploadMedia } from '@/lib/media';
```

2. Upload with usage context:
```typescript
const file = await uploadMedia(buffer, {
  originalName: 'file.jpg',
  mimeType: 'image/jpeg',
  usedBy: {
    type: pageId,
    field: 'heroImage',
    module: 'page'
  }
});
```

3. Store returned URL in your data model

### Media References in Database

Track where media is used in your schemas:

```typescript
// Blog Model
{
  thumbnail: { type: String },  // Store the public URL
  contentHTML: { type: String }
}

// Usage is also tracked in Media collection
// → Query media.usedBy to find all references
```

---

## Best Practices

### When Uploading

✅ Always include usage context for tracking  
✅ Let the service handle filename sanitization  
✅ Store the returned `publicUrl` in your model  

### When Deleting

⚠️ Check `usedBy` references before hard-deleting  
⚠️ Prefer soft-delete to avoid breaking existing references  

### When Selecting

✅ Use the media modal for consistent UX  
✅ Allow search to find files quickly  
✅ Show thumbnails for visual selection  

---

## Database Queries

### Find media used by a blog:

```typescript
Media.findOne({ 
  filename,
  'usedBy.type': blogId,
  'usedBy.module': 'blog'
})
```

### Find all references to a media file:

```typescript
Media.findOne({ filename })
  .then(media => media.usedBy)  // Shows all usages
```

### Find unused media:

```typescript
Media.find({ 
  isDeleted: false,
  usedBy: { $size: 0 }
})
```

---

## Migration Notes

### From Old System

Previously, media wasn't tracked in the database. The new system:

1. ✅ Stores all future uploads with metadata
2. ✅ Tracks usage relationships
3. ✅ Provides search and filtering
4. ⚠️ Existing files remain accessible but aren't in DB

To migrate existing files:

```typescript
// Scan public/blogs/Media/ and create DB records
const files = await fs.readdir(MEDIA_DIR);
for (const file of files) {
  if (!await Media.findOne({ filename: file })) {
    await Media.create({
      filename: file,
      publicUrl: `/blogs/Media/${file}`,
      // ... other fields
    });
  }
}
```

---

## Performance Considerations

### Indexing

Database indexes for fast queries:
- `filename` (unique lookup)
- `uploadedAt` (sorting by date)
- `usedBy.type` (finding media by reference)
- `isDeleted` (filtering deleted items)

### Pagination

- Default limit: 100 items
- Max limit: 200 items
- Use `skip` for pagination

### Caching

Consider caching media list on client side:
```typescript
// Cache in component state
const [mediaCache, setMediaCache] = useState([]);
useEffect(() => {
  fetch('/api/admin/media').then(res => res.json())
    .then(data => setMediaCache(data.items));
}, []);
```

---

## Troubleshooting

### Media not appearing in gallery

1. Check if upload was successful (check response)
2. Verify file exists: `/public/blogs/Media/{filename}`
3. Check MongoDB: `db.media.find()`

### Thumbnails not persisting

1. Verify blog model has `thumbnail` field
2. Check if URL is being saved: `blog.thumbnail`
3. Verify media file still exists at the URL

### Slow media page

1. Reduce limit: `?limit=50`
2. Add search filter: `?q=keyword`
3. Implement pagination in UI

---

## Future Enhancements

- [ ] Image optimization/compression on upload
- [ ] Thumbnail generation for images
- [ ] Media categorization/tagging
- [ ] Bulk operations (upload, delete)
- [ ] Drag & drop reordering
- [ ] Media duplication detection
- [ ] Usage analytics per file
- [ ] Expiry/archive policies

---

**System Status**: ✅ Fully Centralized & Operational
