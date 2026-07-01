window.addEventListener("DOMContentLoaded", () => {

    // safety check
    if (!window.GALLERY_DATA) {
        console.error("GALLERY_DATA not loaded!");
        return;
    }

    // language default
    if (window.setLang) {
        setLang("pl");
    }

    // mark initial active nav link
    const menuHome = document.getElementById("menuHome");
    if (menuHome) menuHome.classList.add("nav-active");

    // render galleries (ONE SYSTEM)
    if (window.renderGallery) {

        if (window.GALLERY_DATA.family) {
            renderGallery("family-gallery", window.GALLERY_DATA.family);
        } else {
            console.warn("No family data");
        }

        if (window.GALLERY_DATA.travels) {
            renderGallery("travels-category", window.GALLERY_DATA.travels);
        } else {
            console.warn("No travels data");
        }

        // Architecture and memories data will render on demand when tabs are selected.
        if (!window.GALLERY_DATA.architecture) {
            console.warn("No architecture data");
        }
        if (!window.MEMORY_DATA) {
            console.warn("No memory data");
        }

        if (window.CUSTOM_LIGHTBOX) {
            window.CUSTOM_LIGHTBOX.collectGalleryAnchors();
        }

    } else {
        console.error("renderGallery missing");
    }

});