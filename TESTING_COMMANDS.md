# Testing & Verification Commands

## Quick Start - Test the System

### 1. Check Server is Running
```bash
curl -s http://localhost:3000 | head -20
```

### 2. Upload a Test File
```bash
# Create test file
echo '<svg><rect fill="#FF6B6B" width="400" height="300"/></svg>' > /tmp/test.svg

# Upload to media system
curl -s -X POST 'http://localhost:3000/api/admin/media' \
  -b /tmp/cookies.txt \
  -F "file=@/tmp/test.svg" | jq '.'

# Expected response:
# {
#   "ok": true,
#   "file": {
#     "filename": "1234567890-abcd1234.svg",
#     "publicUrl": "/blogs/Media/1234567890-abcd1234.svg",
#     "size": 56,
#     "uploadedAt": "2026-05-10T20:10:29.854Z"
#   }
# }
```

### 3. List All Media
```bash
curl -s 'http://localhost:3000/api/admin/media?limit=5' \
  -b /tmp/cookies.txt | jq '.'

# Should show items array with media records
```

### 4. Search Media
```bash
curl -s 'http://localhost:3000/api/admin/media?q=svg&limit=10' \
  -b /tmp/cookies.txt | jq '.items | length'

# Should return number of SVG files found
```

### 5. Delete Media
```bash
# Get a filename from list
FILENAME=$(curl -s 'http://localhost:3000/api/admin/media?limit=1' \
  -b /tmp/cookies.txt | jq -r '.items[0].filename')

echo "Deleting: $FILENAME"

# Delete it
curl -s -X DELETE 'http://localhost:3000/api/admin/media' \
  -b /tmp/cookies.txt \
  -H "Content-Type: application/json" \
  -d "{\"filename\":\"$FILENAME\"}" | jq '.'
```

---

## API Endpoint Tests

### GET - List Media (Paginated)
```bash
# Get first 10 items
curl 'http://localhost:3000/api/admin/media?limit=10&skip=0'

# Get items 20-30
curl 'http://localhost:3000/api/admin/media?limit=10&skip=20'

# With auth
curl 'http://localhost:3000/api/admin/media?limit=10' -b /tmp/cookies.txt
```

### GET - Search Media
```bash
# Search by filename
curl 'http://localhost:3000/api/admin/media?q=logo'

# Search partial match (case-insensitive)
curl 'http://localhost:3000/api/admin/media?q=blog'

# With limit
curl 'http://localhost:3000/api/admin/media?q=image&limit=20'
```

### POST - Upload Media
```bash
# Simple upload
curl -X POST 'http://localhost:3000/api/admin/media' \
  -F "file=@/path/to/file.jpg"

# Upload with usage metadata
curl -X POST 'http://localhost:3000/api/admin/media' \
  -F "file=@/path/to/file.jpg" \
  -F 'usedBy={"type":"blog","field":"thumbnail","module":"blog"}'

# Multiple files
for file in image1.jpg image2.jpg image3.jpg; do
  curl -X POST 'http://localhost:3000/api/admin/media' \
    -F "file=@$file"
done
```

### DELETE - Remove Media
```bash
# Soft delete (preserves record)
curl -X DELETE 'http://localhost:3000/api/admin/media' \
  -H "Content-Type: application/json" \
  -d '{"filename":"1234567890-abcd1234.jpg","hardDelete":false}'

# Hard delete (removes file)
curl -X DELETE 'http://localhost:3000/api/admin/media' \
  -H "Content-Type: application/json" \
  -d '{"filename":"1234567890-abcd1234.jpg","hardDelete":true}'
```

---

## File System Tests

### Check Storage Directory
```bash
# List media directory
ls -lh public/blogs/Media/

# Count files
ls -1 public/blogs/Media/ | wc -l

# Check directory size
du -sh public/blogs/Media/
```

### Check File Permissions
```bash
# Verify directory is writable
touch public/blogs/Media/.test && rm public/blogs/Media/.test && echo "✓ Writable"

# Check file permissions
ls -l public/blogs/Media/ | head -5
```

### Verify Public URL
```bash
# Get a filename
FILENAME=$(ls -1 public/blogs/Media/ | head -1)

# Check if accessible via HTTP
curl -I "http://localhost:3000/blogs/Media/$FILENAME"

# Should return 200 OK
```

---

## Database Tests

### Check MongoDB Connection
```bash
# From Node.js
node -e "
const { MongoClient } = require('mongodb');
MongoClient.connect(process.env.MONGODB_URI).then(client => {
  console.log('✓ Connected to MongoDB');
  client.close();
});
"
```

### Query Database Directly
```bash
# Count media records
mongo <connection_string> --eval "db.medias.countDocuments()"

# Get sample record
mongo <connection_string> --eval "db.medias.findOne()"

# Find by filename
mongo <connection_string> --eval "db.medias.findOne({filename: '1234567890-abcd1234.jpg'})"
```

### Check Indexes
```bash
mongo <connection_string> --eval "db.medias.getIndexes()"

# Should show:
# - _id (default)
# - filename (unique)
# - uploadedAt
# - isDeleted
```

---

## Build & Deployment Tests

### Build the Project
```bash
npm run build

# Should complete with:
# ✓ Compiled successfully
# Built in X.XXs
```

### Check for Errors
```bash
npm run build 2>&1 | grep -i error || echo "✓ No errors"
```

### Check TypeScript
```bash
npx tsc --noEmit

# Should output nothing if all good
```

### Run Production Build
```bash
npm run build && npm start

# Server should start on port 3000
# Should see: 'ready - started server on 0.0.0.0:3000, url: http://localhost:3000'
```

---

## UI Tests (Manual Browser)

### Media Page
```
1. Open http://localhost:3000/admin/media
2. Should see:
   - Grid of media thumbnails
   - Pagination controls
   - Search input
   - View mode toggle
3. Test search: Type "svg" → Should filter items
4. Test pagination: Click "Next" → Should load next page
5. Test view toggle: Switch to list → Should show list view
6. Test delete: Click delete icon → Confirm dialog → Item removed
```

### Blog Editor
```
1. Go to http://localhost:3000/admin/blogs/[blog-id]/edit
2. Scroll to thumbnail section
3. Click on thumbnail field
4. Should see modal with two tabs:
   - "Upload New" → File input for direct upload
   - "From Gallery" → Grid of existing media
5. Test upload: Select file → See it added to gallery
6. Test select: Click gallery image → See selection highlight
7. Close modal and save blog
```

---

## Performance Tests

### API Response Time
```bash
# Test with timing
time curl -s 'http://localhost:3000/api/admin/media?limit=100' > /dev/null

# Should complete in < 1 second
```

### Upload Performance
```bash
# Create 10MB file
dd if=/dev/zero of=/tmp/large.bin bs=1M count=10

# Time the upload
time curl -X POST 'http://localhost:3000/api/admin/media' \
  -F "file=@/tmp/large.bin" > /dev/null

# Should complete in reasonable time
```

### Search Performance
```bash
# Search with result count
curl -s 'http://localhost:3000/api/admin/media?q=test' \
  -b /tmp/cookies.txt | jq '.items | length'

# Time search on large dataset
time curl -s 'http://localhost:3000/api/admin/media?q=test' > /dev/null
```

---

## Troubleshooting Tests

### If Upload Fails
```bash
# 1. Check auth
curl -I -X POST 'http://localhost:3000/api/admin/media' \
  -F "file=@test.txt"
# If 401: Not authenticated, use cookies

# 2. Check file permissions
ls -ld public/blogs/Media/
touch public/blogs/Media/test && rm public/blogs/Media/test

# 3. Check server logs
tail -50 /tmp/dev.log

# 4. Check database connection
npm run build 2>&1 | grep -i error
```

### If Media Not Appearing
```bash
# 1. Check database
mongo <connection_string> --eval "db.medias.countDocuments()"

# 2. Check file on disk
ls -l public/blogs/Media/

# 3. Check file permissions
ls -l public/blogs/Media/1234567890-*.jpg

# 4. Check public URL
curl -I http://localhost:3000/blogs/Media/[filename]
```

### If Search Not Working
```bash
# 1. Check database records
mongo <connection_string> --eval "
db.medias.find({}, {filename: 1, originalName: 1}).limit(5)
"

# 2. Test search query
curl 'http://localhost:3000/api/admin/media?q=test&limit=100' \
  | jq '.items | length'

# 3. Check indexes
mongo <connection_string> --eval "db.medias.getIndexes()"
```

---

## Full Integration Test Script

```bash
#!/bin/bash

echo "=== FULL MEDIA SYSTEM TEST ==="

# 1. Create test file
echo "✓ Creating test file..."
echo '<svg><rect fill="#FF6B6B" width="400" height="300"/></svg>' > /tmp/test.svg

# 2. Upload
echo "✓ Uploading file..."
RESPONSE=$(curl -s -X POST 'http://localhost:3000/api/admin/media' \
  -b /tmp/cookies.txt \
  -F "file=@/tmp/test.svg")
FILENAME=$(echo "$RESPONSE" | jq -r '.file.filename // "ERROR"')

if [ "$FILENAME" = "ERROR" ]; then
  echo "✗ Upload failed"
  echo "$RESPONSE" | jq '.'
  exit 1
fi

echo "  Uploaded: $FILENAME"

# 3. Query
echo "✓ Querying media..."
TOTAL=$(curl -s 'http://localhost:3000/api/admin/media?limit=1' \
  -b /tmp/cookies.txt | jq '.total')
echo "  Total media: $TOTAL"

# 4. Search
echo "✓ Searching..."
SVG_COUNT=$(curl -s 'http://localhost:3000/api/admin/media?q=svg' \
  -b /tmp/cookies.txt | jq '.items | length')
echo "  Found $SVG_COUNT SVG files"

# 5. Check disk
echo "✓ Checking disk storage..."
DISK_COUNT=$(ls -1 public/blogs/Media/ 2>/dev/null | wc -l)
echo "  Files on disk: $DISK_COUNT"

# 6. Verify URL
echo "✓ Checking public URL..."
CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "http://localhost:3000/blogs/Media/$FILENAME")
echo "  HTTP Status: $CODE"

if [ "$CODE" = "200" ]; then
  echo ""
  echo "✅ ALL TESTS PASSED"
  exit 0
else
  echo ""
  echo "⚠️  URL test returned $CODE"
  exit 1
fi
```

---

## Continuous Monitoring

### Watch for Changes
```bash
# Watch for new media files
watch 'ls -1 public/blogs/Media/ | wc -l'

# Monitor API requests
tail -f /tmp/dev.log | grep "api/admin/media"

# Monitor database
watch 'mongo <uri> --eval "db.medias.countDocuments()"'
```

---

**All tests should pass. If any fail, check the logs and troubleshooting section above.**
