# Karol Grzegorczyk website

This project is a small static website for presenting memories, photos, and work content. The main content lives under `docs/`, and most site data is driven by JavaScript files in `docs/js/data/`.

## 1) Adding new images

1. Put the image in the correct folder under `docs/images/` or in the relevant gallery folder.
2. Use a clear filename, ideally lowercase and simple, for example:
   - `docs/images/Memmories/Anna.webp`
   - `docs/images/USA/IMG_1234.webp`
3. In the data file, reference the path relative to the page root. For example:

```js
images: [{ src: "images/Memmories/Anna.webp", alt: "Wspomnienie – Anna" }]
```

Notes:
- Prefer `.webp` for lighter files.
- Keep file names consistent with the existing naming pattern.
- If the image is a portrait or a special full-width memory, also check whether a `category: "image-full"` layout is needed.

## 2) Adding a new memory entry

Memory entries are defined in `docs/js/data/memories.js`.

Each item usually looks like this:

```js
{
  title: "Marysia",
  images: [],
  text: `Your memory text here...`
}
```

If the memory has a photo, add it like this:

```js
{
  title: "Anna",
  images: [{ src: "images/Memmories/Anna.webp", alt: "Wspomnienie – Anna" }],
  text: `Your memory text here...`
}
```

For a full-width image treatment, add:

```js
category: "image-full",
```

Add the new object into the `pl` array in the same style as existing entries.

## 3) Updating text content

Static text such as headings or contact text may live directly in `docs/index.html` or in the language data file `docs/js/lang.js`.

If you want to change:
- the homepage intro,
- the contact message,
- or language-specific labels,

check `docs/index.html` and `docs/js/lang.js` first.

## 4) Working with galleries

Gallery content is split into data files such as:
- `docs/js/data/family.js`
- `docs/js/data/travels.js`
- `docs/js/data/memories.js`

Each file exports a data structure consumed by the page. If you add a new gallery item, follow the same structure as nearby entries.

### Adding a new album to Family or Travels

1. Put the images in the matching folder under `docs/images/`.
   - Example: `docs/images/USA/`, `docs/images/Indie/`, `docs/images/rodzinne/`
2. Open the relevant file:
   - `docs/js/data/family.js` for family/event galleries
   - `docs/js/data/travels.js` for travel galleries
3. Add a new object in the same array style as the existing entries.

Example structure:

```js
{
  title: "USA",
  images: [
    "images/USA/01.webp",
    "images/USA/02.webp",
    "images/USA/03.webp"
  ]
}
```

Or with captions:

```js
{
  title: "Indie",
  images: [
    { src: "images/Indie/01.webp", alt: "Indie 1" },
    { src: "images/Indie/02.webp", alt: "Indie 2" }
  ]
}
```

Important:
- The image paths must match the actual files on disk.
- The `title` is usually the album name shown on the page.
- The order in the array controls the order on the page.
- If a new album needs a custom visual treatment, check the gallery-rendering logic before adding it.

## 5) Local preview

Open `docs/index.html` in a browser, or run a local static server from the project root if needed.

## 6) Commit and publish

After changes:

```bash
git add .
git commit -m "Describe your change"
git push origin main
```

Keep changes small and clear, and use commit messages that describe the content update instead of generic wording.

## Quick checklist

- Image exists in the correct folder
- Path in data matches the actual file location
- Title and text are correct
- Layout matches the intended gallery style
- Changes are tested visually in the browser
