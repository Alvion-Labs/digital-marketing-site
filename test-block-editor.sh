#!/bin/bash

# Test creating a blog with blocks via API

echo "Creating test blog post with blocks..."

curl -i -X POST 'http://localhost:3000/api/admin/auth' \
  -H 'Content-Type: application/json' \
  -d '{"password":"itsme"}' \
  -c /tmp/cookies.txt

echo ""
echo "Creating blog with block content..."

curl -X POST 'http://localhost:3000/api/admin/blogs' \
  -H 'Content-Type: application/json' \
  -b /tmp/cookies.txt \
  -d '{
    "title": "Block Editor Test Post",
    "slug": "block-editor-test",
    "excerpt": "Testing the new block-based editor",
    "author": "Test Author",
    "category": "Demo",
    "isDraft": false,
    "contentBlocks": [
      {
        "id": "block_1",
        "type": "heading",
        "data": {
          "text": "Welcome to the Block Editor",
          "level": 1,
          "align": "center"
        }
      },
      {
        "id": "block_2",
        "type": "paragraph",
        "data": {
          "text": "This is a test blog post created with the new block-based editor. Each block type provides a different way to structure your content.",
          "style": "normal",
          "align": "left"
        }
      },
      {
        "id": "block_3",
        "type": "heading",
        "data": {
          "text": "Block Types Available",
          "level": 2,
          "align": "left"
        }
      },
      {
        "id": "block_4",
        "type": "list",
        "data": {
          "items": ["Paragraph - Rich text content", "Heading - Section titles", "Image - Visual media", "Quote - Pull quotes", "CTA - Call-to-action buttons", "List - Bullet and numbered lists", "Divider - Visual separators"],
          "ordered": true
        }
      },
      {
        "id": "block_5",
        "type": "quote",
        "data": {
          "text": "Creative freedom without limitations - design your content your way.",
          "author": "Block Editor",
          "style": "highlighted"
        }
      },
      {
        "id": "block_6",
        "type": "cta",
        "data": {
          "title": "Ready to Create?",
          "description": "Start building amazing content with the block editor.",
          "buttonText": "Get Started",
          "buttonUrl": "/admin/blogs",
          "buttonStyle": "primary",
          "align": "center"
        }
      }
    ]
  }' | jq .
