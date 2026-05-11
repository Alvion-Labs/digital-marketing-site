# Block Editor Guide

Welcome to the new **Block-Based Content Editor** for Alvion Digital Marketing! This modern editor gives you complete creative freedom while maintaining security and semantic HTML output.

## 🎯 Overview

The block editor replaces free-typed HTML with a structured, intuitive interface. Each block type serves a specific purpose and provides design controls without requiring technical knowledge.

**Key Benefits:**
- ✅ Drag-and-drop reordering
- ✅ Full creative control with preset designs
- ✅ Semantic HTML output (clean, SEO-friendly)
- ✅ Automatic sanitization (secure)
- ✅ Live preview while editing
- ✅ No Tailwind class typing needed

---

## 📦 Block Types

### 1. **Paragraph** - Rich Text Content
Use for body text and descriptions.

**Options:**
- **Text**: Enter your content (supports multi-line)
- **Size**: Small, Normal, or Large
- **Alignment**: Left, Center, or Right

**Example:** Perfect for blog body text, descriptions, and flowing narrative content.

---

### 2. **Heading** - Section Titles
Structure your content with hierarchical headings.

**Options:**
- **Text**: Your heading title
- **Level**: H1 (largest), H2 (medium), H3 (small)
- **Alignment**: Left, Center, or Right

**Best Practice:** Use H1 for main titles, H2 for sections, H3 for subsections.

---

### 3. **Image** - Visual Media
Embed images with captions and alignment.

**Options:**
- **Image URL**: Link to your image (use admin media gallery)
- **Alt Text**: Accessibility description (required)
- **Caption**: Optional text below image
- **Alignment**: Left, Center, or Right

**Tip:** Always provide descriptive alt text for accessibility and SEO.

---

### 4. **Quote** - Pull Quotes
Highlight important statements or testimonials.

**Options:**
- **Quote Text**: The quoted content
- **Author**: Optional attribution (e.g., "— John Doe")
- **Style**: 
  - **Default**: Subtle gray border
  - **Highlighted**: Eye-catching blue background
  - **Minimal**: Clean italic text

**Use Cases:** Testimonials, author quotes, key insights

---

### 5. **CTA** - Call-to-Action
Encourage readers to take action.

**Options:**
- **Title**: Main CTA heading
- **Description**: Optional additional text
- **Button Text**: "Learn More", "Get Started", etc.
- **Button URL**: Where the button links to
- **Button Style**:
  - **Primary**: Eye-catching blue button
  - **Secondary**: Subtle gray button
  - **Outline**: Bordered button style
- **Alignment**: Left, Center, or Right

**Example:** "Ready to grow your business? Check out our services."

---

### 6. **List** - Bullet & Numbered Lists
Organize information in list format.

**Options:**
- **List Type**: Bullet (•) or Numbered (1, 2, 3...)
- **Items**: Add as many items as needed
  - Click "+ Add Item" to expand
  - Click ✕ to remove an item

**Use Cases:** Feature lists, steps, benefits, requirements

---

### 7. **Divider** - Visual Separators
Break up sections with a horizontal line.

**Options:**
- **Style**: Solid, Dashed, or Dotted

**Tip:** Use to visually separate major sections without adding content.

---

## 🎮 Editor Interface

### Quick Add Buttons (Top)
The sticky toolbar at the top lets you add new blocks quickly:
- **H** = Heading
- **¶** = Paragraph
- **🖼** = Image
- **"** = Quote
- **→** = CTA
- **≡** = List
- **—** = Divider

### Block Controls
Each block has:
- **☰** (drag handle): Reorder blocks by dragging
- **↑ ↓** (arrow buttons): Move block up/down
- **✕** (delete): Remove the block
- **+ Add Below**: Insert a new block right after this one

### Live Preview
The right panel shows a real-time preview of how your content will appear to readers.

---

## 🔄 Workflow

### Creating a New Post
1. Go to **Admin > Blogs > New Post**
2. Fill in Post Details (title, slug, category, etc.)
3. Click in the **Block Editor** section
4. Click a block type button to start creating
5. Fill in block content and adjust options
6. Drag to reorder blocks as needed
7. Watch the **Live Preview** on the right
8. Click **Save Post** when done

### Editing an Existing Post
1. Go to **Admin > Blogs**
2. Click **Edit** on any post
3. Modify blocks or add new ones
4. Reorder by dragging
5. Click **Save Post** to update

### Keyboard Shortcuts
- **Cmd/Ctrl + S**: Save post
- **Cmd/Ctrl + Shift + E**: Toggle editor panel
- **Cmd/Ctrl + Shift + P**: Toggle preview panel

---

## 💡 Best Practices

### Structure & Organization
- ✅ Start with a clear H1 heading
- ✅ Use H2 for main sections, H3 for subsections
- ✅ Add dividers between major topic shifts
- ✅ Keep paragraphs concise (2-4 sentences max)

### Readability
- ✅ Use size variations: Large for emphasis, Normal for body, Small for notes
- ✅ Center important CTAs or quotes
- ✅ Align paragraphs left for better readability
- ✅ Break up long content with images or dividers

### Calls-to-Action
- ✅ Use Primary (blue) buttons for main CTAs
- ✅ Use Secondary/Outline for less important actions
- ✅ Always test button links work correctly
- ✅ Center CTAs for maximum visibility

### Images
- ✅ Use descriptive alt text (for SEO + accessibility)
- ✅ Center images for visual impact
- ✅ Add captions for context
- ✅ Optimize image size before uploading (< 1MB recommended)

### Lists
- ✅ Use bullets for unordered items (features, tips)
- ✅ Use numbered lists for ordered steps or rankings
- ✅ Keep list items parallel in structure
- ✅ Don't nest lists deeply (2 levels max)

---

## 🔐 Security & Data

### What Happens to Your Content
1. **Editor** (Your Device): You type and arrange blocks
2. **Save** (Server): Blocks convert to clean HTML + stored as JSON
3. **Display** (Public): HTML is sanitized, then rendered to readers

### Sanitization
- ✅ All user input is validated
- ✅ Only safe HTML tags are allowed
- ✅ Scripts, iframes, and forms are blocked
- ✅ No risk of XSS attacks

### Block Data Storage
- **contentBlocks**: Raw JSON blocks (editable format)
- **contentHTML**: Rendered HTML (read-only, auto-generated)

Both are stored for flexibility and performance.

---

## 📱 Preview & Testing

### Live Preview Panel
The right column shows **exactly** how your content will appear:
- Responsive design (matches mobile/desktop views)
- Real typography and spacing
- Button styling and links
- All block formatting

### Before Publishing
- [ ] Read through live preview carefully
- [ ] Test all links (CTAs, external URLs)
- [ ] Check image alt text is descriptive
- [ ] Verify headings make sense
- [ ] Ensure content flows logically

---

## 🚀 Tips for Maximum Impact

### Engagement
- Start with a compelling H1
- Use quotes to highlight insights
- Add images for visual interest
- End with a clear CTA

### SEO
- Include relevant keywords naturally in headings
- Write descriptive alt text for images
- Use lists for featured content
- Link to related blog posts in CTAs

### Accessibility
- Always provide alt text for images
- Use proper heading hierarchy (H1 → H2 → H3)
- Ensure sufficient color contrast
- Test with screen readers if possible

---

## 🐛 Troubleshooting

### Blocks not saving?
- Ensure all required fields are filled
- Check browser console for errors
- Try saving with Cmd/Ctrl + S

### Preview looks wrong?
- Refresh the page (Cmd/Ctrl + R)
- Clear browser cache
- Check image URLs are valid

### Lost content?
- Your changes auto-save to the form
- Refresh to retrieve from database
- Contact admin if still having issues

---

## 📊 Example Blog Structure

**Great blog posts typically follow this pattern:**

```
H1: Main Title
  ↓
Paragraph: Introduction/Hook
  ↓
H2: Key Section 1
  List or Images (support content)
  Divider
  ↓
H2: Key Section 2
  Paragraph + Image
  Quote (from expert)
  Divider
  ↓
H2: Key Section 3
  List (key points)
  Divider
  ↓
H2: Conclusion
  Paragraph + CTA Button
```

---

## 📞 Need Help?

- **Editor not working?** Check that JavaScript is enabled
- **Lost a block?** Use browser back button or refresh
- **Technical issues?** Check the browser console (F12)
- **Feature requests?** Contact the development team

---

**Happy creating! Your content, your way. 🎨**
