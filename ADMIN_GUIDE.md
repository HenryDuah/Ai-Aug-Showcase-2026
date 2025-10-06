# AI Lab Guided Tour - Admin Guide

## Overview
The AI Lab Guided Tour is a mobile-first web application that provides an interactive self-guided experience of medical innovations displayed in your physical lab. Visitors access the app by scanning a QR code.

## Content Management

### Managing Products

All products are stored in a **single JSON file** that you can edit directly:

**File Location:** `server/data/products.json`

#### Editing Products

1. Open `server/data/products.json` in any text editor
2. Each product has the following structure:

```json
{
  "id": "unique-product-id",
  "name": "Product Name",
  "company": "Company Name",
  "type": "Product Type",
  "description": "Product description (50-100 words recommended)",
  "image": "https://image-url.com/image.jpg",
  "audioUrl": "https://audio-url.com/audio.mp3",
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "sectionId": 1,
  "sectionName": "Section Name",
  "onDisplay": true
}
```

#### Field Explanations

- **id**: Unique identifier (use lowercase with hyphens, e.g., "keyar-echo")
- **name**: Product display name
- **company**: Manufacturer/company name
- **type**: Product category/type
- **description**: Brief description (50-100 words work best)
- **image**: High-resolution image URL (recommended: 800x450px or 16:9 ratio)
- **audioUrl**: URL to audio guide MP3 file (or `null` if no audio)
- **features**: Array of key features (3-5 recommended)
- **sectionId**: Section number (1-5):
  - 1 = Maternal
  - 2 = Neonatal
  - 3 = General Screening
  - 4 = Rapid Diagnostic Tests
  - 5 = Software Solutions
- **sectionName**: Must match the section (see list above)
- **onDisplay**: `true` to show, `false` to hide (can also toggle via Admin Panel)

#### Adding a New Product

1. Open `server/data/products.json`
2. Copy an existing product object
3. Paste it into the products array
4. Update all fields with the new product information
5. Ensure the `id` is unique
6. Save the file
7. Restart the server: The app will reload automatically

#### Removing a Product

1. Open `server/data/products.json`
2. Find the product object you want to remove
3. Delete the entire object (including the comma if needed)
4. Save the file
5. Restart the server

### Admin Panel (Web UI)

For quick visibility toggles without editing JSON, use the **Admin Panel**:

1. Navigate to your app's homepage
2. Click "Admin Panel" button at the bottom
3. You'll see all products organized by section
4. Toggle the switch next to any product to hide/show it
5. Changes are saved automatically to the JSON file

**Admin Panel URL:** `your-app-url/admin`

## Daily Display Management

If you have more devices per section but want to show only a few at a time:

### Option 1: Admin Panel (Recommended)
1. Go to `/admin`
2. Toggle products on/off for today's display
3. Changes take effect immediately

### Option 2: Edit JSON File
1. Open `server/data/products.json`
2. Set `"onDisplay": false` for products not shown today
3. Set `"onDisplay": true` for products on display today
4. Save the file

## Sections Configuration

The 5 sections are defined in `client/src/data/products.json`:

```json
{
  "sections": [
    {
      "id": 1,
      "name": "Maternal",
      "description": "Maternal health monitoring devices",
      "color": "from-primary to-chart-3"
    }
  ]
}
```

To update section names or descriptions:
1. Edit `client/src/data/products.json`
2. Update the name or description
3. Also update `sectionName` in products to match

## Image Guidelines

### Recommended Image Specs
- **Format:** JPG or PNG
- **Aspect Ratio:** 16:9 (e.g., 1600x900, 800x450)
- **File Size:** Under 500KB for fast loading
- **Resolution:** 800px width minimum

### Image Hosting Options
1. **Unsplash** (free): `https://images.unsplash.com/...`
2. **Imgur** (free): Upload and get direct link
3. **Your own server**: Host images and use the URL

## Audio Guidelines

### Audio File Specs
- **Format:** MP3
- **Duration:** 30-90 seconds recommended
- **Bitrate:** 128kbps or higher
- **Hosting:** Any public URL accessible via HTTPS

### Adding Audio
1. Upload your MP3 file to a public hosting service
2. Copy the direct file URL
3. Add it to the `audioUrl` field in the product JSON
4. Set to `null` if no audio is available

## Sample Product Entry

```json
{
  "id": "keyar-echo",
  "name": "Keyar Echo",
  "company": "Janitri",
  "type": "Smart handheld fetal doppler",
  "description": "A compact, AI-powered fetal doppler designed to measure fetal heart rate with accuracy and ease of use in maternal health settings.",
  "image": "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
  "audioUrl": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "features": [
    "AI-powered heart rate detection",
    "Clear audio output",
    "Portable and lightweight design",
    "Easy-to-use interface"
  ],
  "sectionId": 1,
  "sectionName": "Maternal",
  "onDisplay": true
}
```

## Feedback Management

Visitor feedback is stored in memory and accessible via API:

**Endpoint:** `GET /api/feedback`

To view feedback:
1. Use a tool like Postman or your browser
2. Navigate to: `your-app-url/api/feedback`
3. You'll see all submitted feedback in JSON format

## Troubleshooting

### Products Not Showing
- Check `onDisplay` is set to `true`
- Verify `sectionId` matches the correct section (1-5)
- Ensure JSON file has no syntax errors

### Images Not Loading
- Verify image URL is accessible publicly
- Check that URL starts with `https://`
- Try opening the URL in a browser

### Audio Not Playing
- Verify audio file is MP3 format
- Ensure URL is a direct link to the file
- Check that URL is accessible publicly

### Changes Not Appearing
- Save the JSON file after editing
- Restart the server if changes don't appear
- Check browser console for errors

## Support

For technical issues or questions, refer to the main application code or contact your development team.
