const PREVIEW_LIMIT = 8;

window.renderGallery = function (containerId, data) {

    const container = document.getElementById(containerId);
    if (!container) return;

    const BASE = "";

    container.innerHTML = "";

    if (!data || Object.keys(data).length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = (window.GALLERY_LABELS && window.GALLERY_LABELS.noPhotos) ? window.GALLERY_LABELS.noPhotos : 'No photos available for this category.';
        container.appendChild(emptyMessage);
        return;
    }

    Object.entries(data).forEach(([album, items]) => {

        const section = document.createElement("div");
        section.className = "photo-subsection";

        const title = document.createElement("h3");
        title.innerText = album;

        const strip = document.createElement("div");
        strip.className = "strip";

        items.forEach((item, index) => {
            const itemWrapper = document.createElement("div");
            itemWrapper.className = "strip-item";
            if (index >= PREVIEW_LIMIT) {
                itemWrapper.classList.add('preview-hidden');
            }

            const captionText = window.currentLang === 'en'
                ? (item.caption_en || item.title_en || item.caption || item.title)
                : (item.caption || item.title);
            const itemLink = BASE + item.large;
            const isVideo = /\.(mov|mp4)$/i.test(item.large);
            const link = document.createElement("a");
            link.href = itemLink;
            link.setAttribute("data-pswp-width", "1600");
            link.setAttribute("data-pswp-height", "1200");
            link.setAttribute("data-pswp-caption", captionText || "");

            const img = document.createElement("img");
            img.src = BASE + (isVideo ? (item.thumb || 'images/video-placeholder.svg') : item.thumb);
            img.alt = captionText ? `${captionText}${isVideo ? ' (video)' : ''}` : (isVideo ? 'Video' : 'Photo');
            img.title = captionText || "";
            if (isVideo) img.dataset.video = 'true';
            img.loading = "lazy";
            img.decoding = "async";

            link.appendChild(img);
            itemWrapper.appendChild(link);

            if (captionText) {
                const caption = document.createElement("span");
                caption.className = "caption";
                caption.innerText = captionText;
                itemWrapper.appendChild(caption);
            }

            strip.appendChild(itemWrapper);
        });

        section.appendChild(title);
        section.appendChild(strip);

        if (items.length > PREVIEW_LIMIT) {
            const showMore = document.createElement('button');
            showMore.className = 'gallery-show-more';
            showMore.type = 'button';
            showMore.dataset.total = items.length;
            const label = (window.GALLERY_LABELS && window.GALLERY_LABELS.showAll) ? window.GALLERY_LABELS.showAll : `Show all photos`;
            showMore.innerText = `${label} (${items.length})`;
            showMore.addEventListener('click', () => {
                section.querySelectorAll('.preview-hidden').forEach(hiddenItem => {
                    hiddenItem.classList.remove('preview-hidden');
                });
                showMore.remove();
            });
            section.appendChild(showMore);
        }

        container.appendChild(section);
    });
};

window.showGalleryCategory = function (category) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    document.querySelectorAll('.photo-category').forEach(section => {
        section.classList.toggle('active', section.id === `${category}-category`);
    });

    const targetSection = document.getElementById(`${category}-category`);
    if (targetSection && targetSection.children.length === 0 && window.GALLERY_DATA && window.GALLERY_DATA[category]) {
        renderGallery(`${category}-category`, window.GALLERY_DATA[category]);
        if (window.CUSTOM_LIGHTBOX) {
            window.CUSTOM_LIGHTBOX.collectGalleryAnchors();
        }
    }
};