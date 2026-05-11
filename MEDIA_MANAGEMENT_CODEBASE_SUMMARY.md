# Media Management Codebase Summary

## Overview
This document contains the structure and UI patterns of the media management system that exists in the codebase before any new implementations.

---

## 1. Media Management Files Found

### Core Library Files
- **[lib/media.ts](lib/media.ts)** - Media management functions
- **[lib/models/Media.ts](lib/models/Media.ts)** - MongoDB Media model schema
- **[app/api/admin/media/route.ts](app/api/admin/media/route.ts)** - API endpoints for media operations
- **[app/admin/media/page.tsx](app/admin/media/page.tsx)** - Media library UI page

---

## 2. Media Library UI Component ([app/admin/media/page.tsx](app/admin/media/page.tsx))

### Structure
- **File location**: `app/admin/media/page.tsx`
- **Type**: Client-side component using `"use client"`
- **Wrapper**: `AdminAuthGate` for authentication
- **State management**: React `useState` hooks

### Key State Variables
```typescript
const [items, setItems] = useState<MediaItem[]>([]);
const [loading, setLoading] = useState(false);
const [search, setSearch] = useState('');
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
const [page, setPage] = useState(1);
const [pageSize] = useState(24);
const [totalItems, setTotalItems] = useState(0);
const [imageDimensions, setImageDimensions] = useState<Record<string, string>>({});
const [uploading, setUploading] = useState(false);
const [deletingFilename, setDeletingFilename] = useState<string | null>(null);
const [confirmDelete, setConfirmDelete] = useState<MediaItem | null>(null);
const fileRef = useRef<HTMLInputElement | null>(null);
```

### UI Features

#### 1. **Header Section**
- Title: "Media Library"
- Subtitle: "Manage all uploaded media assets"
- Upload button with loading state

#### 2. **Upload Input**
```typescript
<input 
  ref={fileRef} 
  type="file" 
  accept="image/*" 
  className="hidden" 
  onChange={(e) => handleUpload(e.target.files)} 
/>
```
- Hidden file input, triggered via button click
- Accepts image files only
- Handles FormData upload via POST to `/api/admin/media`

#### 3. **Upload Handler**
```typescript
async function handleUpload(files: FileList | null) {
  if (!files || files.length === 0) return;
  setUploading(true);
  addToast('Uploading media...', 'info', 1200);
  const fd = new FormData();
  fd.append('file', files[0]);
  try {
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
    const json = await res.json();
    if (json.ok) {
      addToast('Media uploaded successfully', 'success');
      load();
    } else {
      addToast(json.error || 'Upload failed', 'error');
    }
  } catch (e) {
    console.error(e);
    addToast('Upload failed', 'error');
  } finally {
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }
}
```

#### 4. **Controls Bar**
- Search input field with real-time filtering
- View mode toggle (Grid/List)
- Refresh button

#### 5. **Grid View**
```
Display format: Grid of 2-4 columns (responsive)
- Image preview (h-32, object-contain)
- Hover overlay with:
  - Open button (external link)
  - Copy URL button
- Below image:
  - Original filename
  - File size (formatted)
  - Image dimensions
  - Delete button
```

#### 6. **List View**
```
Table format with columns:
- Image thumbnail (w-8, h-8)
- Name
- Size
- Uploaded date
- Usage count
- Actions (Open, Delete)
```

#### 7. **Pagination**
- Page display: `{page} / {totalPages}`
- Previous/Next buttons
- Showing X of Y files counter

#### 8. **Empty State**
```
- Icon placeholder
- Message: "No media files yet"
- Subtext: "Upload your first image to get started"
```

#### 9. **Delete Confirmation**
- Uses `ConfirmDialog` component
- Shows filename in message
- Dangerous action styling
- Confirmation and cancel options

### API Integration

#### GET `/api/admin/media`
```typescript
// Query parameters:
?q=${query}              // Search query
?limit=${limit}          // Page size (max 200)
?skip=${skip}            // Pagination offset

// Response:
{
  ok: boolean;
  items: MediaItem[];
  total: number;
}
```

#### POST `/api/admin/media`
```typescript
// Body: FormData
fd.append('file', file);

// Response:
{
  ok: boolean;
  file: MediaFile;
  path: string; // publicUrl
}
```

#### DELETE `/api/admin/media`
```typescript
// Body: JSON
{ filename: string }

// Response:
{ ok: boolean }
```

### MediaItem Interface
```typescript
interface MediaItem {
  _id?: string;
  filename: string;
  originalName: string;
  publicUrl: string;
  size: number;
  uploadedAt: string;
  usedBy?: Array<{ type: string; field: string; module: string }>;
}
```

---

## 3. Media Database Model ([lib/models/Media.ts](lib/models/Media.ts))

### Schema Definition
```typescript
{
  // File metadata
  filename: String (unique, required),
  originalName: String,
  mimeType: String,
  size: Number,
  dimensions: {
    width: Number,
    height: Number
  },
  
  // Storage info
  storagePath: String (required, relative path from public/),
  publicUrl: String (required, /blogs/Media/...),
  
  // Usage tracking
  usedBy: [
    {
      type: String,
      field: String,
      module: String
    }
  ],
  
  // Admin info
  uploadedBy: String,
  uploadedAt: Date (default: now),
  updatedAt: Date (default: now),
  description: String,
  tags: [String],
  
  // Soft delete
  isDeleted: Boolean (default: false)
}
```

### Indexes
- `{ uploadedAt: -1 }` - For sorting by recent uploads
- `{ isDeleted: 1 }` - For filtering deleted files

---

## 4. Media Library Functions ([lib/media.ts](lib/media.ts))

### Core Functions

#### `uploadMedia(file, options)`
```typescript
Params:
  file: Buffer
  options?: {
    originalName?: string
    mimeType?: string
    usedBy?: { type: string; field: string; module: string }
  }

Returns: MediaFile

Behavior:
- Generates unique filename: {timestamp}-{randomHex}{ext}
- Writes to disk at: public/blogs/Media/
- Creates MongoDB record
- Returns metadata with publicUrl
```

#### `getAllMedia(filter, limit, skip)`
```typescript
Params:
  filter?: any (default filters by isDeleted: false)
  limit?: number (default 100)
  skip?: number (default 0)

Returns: { items: MediaFile[], total: number }

Behavior:
- Sorts by uploadedAt descending
- Returns paginated results
- Filters soft-deleted files
```

#### `getMediaByFilename(filename)`
```typescript
Returns: MediaFile | null
```

#### `deleteMedia(filename, hardDelete)`
```typescript
Params:
  filename: string
  hardDelete?: boolean (default false)

Behavior if hardDelete=true:
- Removes file from disk
- Deletes record from MongoDB

Behavior if hardDelete=false:
- Sets isDeleted: true in database
- File remains on disk
```

#### `trackMediaUsage(filename, usage)`
```typescript
Params:
  filename: string
  usage: { type: string; field: string; module: string }

Behavior:
- Adds usage reference to usedBy array
- Prevents duplicates
```

#### `removeMediaUsage(filename, usage)`
```typescript
Removes specific usage reference from usedBy array
```

#### `searchMedia(query, limit)`
```typescript
Params:
  query: string
  limit?: number (default 50)

Search fields:
- filename (regex, case-insensitive)
- originalName (regex, case-insensitive)
- tags (array match)

Returns: MediaFile[]
```

### Storage Details
```
Directory: public/blogs/Media/
Filename pattern: {timestamp}-{hex}{ext}
URL format: /blogs/Media/{filename}
Example: /blogs/Media/1778423139604-96794b39.png
```

---

## 5. Toast/Notification System Used

The media library uses a custom Toast component for user feedback:

```typescript
import { ToastContainer, useToast } from '@/components/global/Toast';

// Usage:
const { toasts, addToast, removeToast } = useToast();

// Add toast:
addToast('Message', 'success' | 'error' | 'info', duration?);
```

---

## 6. Drag-and-Drop Patterns

While not used in the media library itself, the codebase includes drag-and-drop in [components/admin/BlockContentEditor.tsx](components/admin/BlockContentEditor.tsx):

```typescript
const [draggedId, setDraggedId] = useState<string | null>(null);

const handleDragStart = (e: React.DragEvent, id: string) => {
  setDraggedId(id);
};

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
};

const handleDrop = (e: React.DragEvent, dropIndex: number) => {
  e.preventDefault();
  if (draggedId === null) return;
  
  const draggedIndex = value.findIndex((block) => block.id === draggedId);
  if (draggedIndex !== -1) {
    moveBlock(draggedIndex, dropIndex);
  }
  setDraggedId(null);
};

// HTML attributes:
draggable
onDragStart={(e) => handleDragStart(e, id)}
onDragOver={handleDragOver}
onDrop={(e) => handleDrop(e, index)}
```

---

## 7. Image Handling in Rich Text Editor

The [components/admin/RichTextEditor.tsx](components/admin/RichTextEditor.tsx) has image insertion via URL:

```typescript
const applyImage = () => {
  const imageUrl = window.prompt('Image URL');
  if (!imageUrl) return;
  editor.chain().focus().setImage({ src: imageUrl }).run();
};

// Uses TipTap Image extension:
Image.configure({
  inline: false,
  allowBase64: false,
})
```

---

## 8. UI Styling Patterns

### Color & Styling Classes Used
```
Buttons:
- "border border-gray-300 rounded-lg"
- "bg-white hover:bg-gray-50"
- "text-gray-700 hover:text-gray-900"
- "px-3 py-2" / "px-4 py-2" (padding)
- "text-xs font-semibold" (text styling)
- "disabled:opacity-60 disabled:cursor-not-allowed"

Grid/Table:
- "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
- "border border-gray-200 rounded-lg"
- "hover:shadow-lg transition-shadow"
- "bg-gray-50" (alternating backgrounds)
- "divide-y divide-gray-200" (row dividers)

Image containers:
- "h-32 bg-gray-100 flex items-center justify-center"
- "max-h-full max-w-full object-contain"
- "absolute inset-0 bg-black/0 group-hover:bg-black/40"
- "group-hover:opacity-100"

Input fields:
- "px-4 py-2 border border-gray-300 rounded-lg"
- "focus:outline-none focus:ring-2 focus:ring-accent-from"

Delete buttons:
- "bg-red-50/70 hover:bg-red-100"
- "border border-red-200 text-red-600"
```

---

## 9. Component Dependencies

### Imports Used in Media Library
```typescript
// React & hooks
import React, { useEffect, useState, useRef } from 'react';

// Admin components
import AdminAuthGate from '@/components/admin/AdminAuthGate';
import Button from '@/components/global/Button';
import ConfirmDialog from '@/components/global/ConfirmDialog';
import { ToastContainer, useToast } from '@/components/global/Toast';
```

---

## 10. Existing Media Files

Located at `public/blogs/Media/`:
- `1778423139604-96794b39.txt`
- `1778423162036-e4ae53fb.txt`
- `1778423380930-91be0aa7.txt`
- `1778423661449-b16d3e84.txt`

---

## Summary of Key UI/UX Patterns

1. **Grid & List toggle**: Two-view mode for browsing media
2. **Search functionality**: Real-time search across filename, originalName, and tags
3. **Pagination**: 24 items per page with prev/next navigation
4. **Upload via file input**: Hidden input with button trigger
5. **Image preview**: Shows dimensions and file size
6. **Hover actions**: Copy URL, Open, Delete on hover
7. **Soft delete**: Confirmation dialog before deletion
8. **Usage tracking**: Shows where each media file is used
9. **Responsive grid**: 2 cols mobile, 3 cols tablet, 4 cols desktop
10. **Toast notifications**: For user feedback on all actions

