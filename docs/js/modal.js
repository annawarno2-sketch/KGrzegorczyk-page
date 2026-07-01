window.addEventListener("DOMContentLoaded", () => {

    const modal = document.createElement("div");
    modal.id = "modal";
    modal.className = "memory-modal";

    const panel = document.createElement("div");
    panel.className = "memory-modal-panel";

    const close = document.createElement("button");
    close.className = "memory-modal-close";
    close.type = "button";
    close.innerText = "×";

    const heading = document.createElement("h3");
    heading.id = "memory-modal-title";

    const content = document.createElement("div");
    content.id = "memory-modal-text";
    content.className = "memory-modal-text";

    const media = document.createElement("div");
    media.id = "memory-modal-media";
    media.className = "memory-modal-media";

    panel.appendChild(close);
    panel.appendChild(heading);
    panel.appendChild(content);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    function closeModal() {
        modal.classList.remove("active");
    }

    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    window.openMemoryModal = function (title, text, images = [], options = {}) {
        const imageFull = !!options.imageFull;
        heading.innerText = title;
        content.innerText = imageFull ? '' : text;
        modal.classList.toggle('memory-modal-image-full', imageFull);

        if (Array.isArray(images) && images.length) {
            media.innerHTML = images.map(image => {
                const src = image && image.src ? image.src : '';
                const alt = image && image.alt ? image.alt : title;
                if (!src) return '';
                return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
            }).join('');
            if (media.innerHTML.trim()) {
                media.style.display = 'block';
                content.prepend(media);
            } else {
                media.style.display = 'none';
                media.remove();
            }
        } else {
            media.innerHTML = '';
            media.style.display = 'none';
            media.remove();
        }

        modal.classList.add("active");
    };

    const memoryContainer = document.querySelector('.memories-container');
    if (memoryContainer) {
        memoryContainer.style.cursor = 'pointer';
        memoryContainer.addEventListener('click', event => {
            const card = event.target.closest('.memory-card');
            if (!card || !memoryContainer.contains(card)) {
                return;
            }
            const title = card.querySelector('h3')?.innerText || '';
            const text = decodeURIComponent(card.dataset.memoryText || '');
            const imageFull = card.dataset.memoryImageFull === '1';
            let images = [];
            try {
                const encoded = card.dataset.memoryImages || '[]';
                images = JSON.parse(decodeURIComponent(encoded));
            } catch (error) {
                images = [];
            }
            window.openMemoryModal(title, text, images, { imageFull });
        });
    } else {
        console.warn('No memory container found for modal wiring');
    }

});