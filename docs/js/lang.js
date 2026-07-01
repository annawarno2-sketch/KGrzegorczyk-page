window.setLang = function (lang) {

    const t = {
        en: {
            home: "HOME",
            family: "FAMILY & EVENTS",
            work: "WORK",
            photography: "PHOTOGRAPHY",
            travels: "TRAVELS",
            architecture: "ARCHITECTURE",
            memories: "MEMORIES",
            homeText: "Discover Karol's world - AI research, modernist architecture, and travel photography.",
            homeTitle: "Welcome",
            workTitle: "About Karol",
            workText: "AI research in deep learning and natural language processing, with work on neural text representations, transfer learning, and optimization of deep neural networks.",
            galleryTitle: "Photo Gallery",
            familyTitle: "Family & Events",
            showAll: "Show all photos",
            noPhotos: "No photos available for this category.",
            loadingWork: "Loading work content…",
            workLoadError: "Unable to load work content. Please refresh the page.",
            docTitle: "Karol Grzegorczyk Photography",
            memoriesTitle: "Memories",
            contactLead: "If you want to add anything or ask about Karol, reach out:"
        },
        pl: {
            home: "START",
            family: "RODZINA I WYDARZENIA",
            work: "PRACA",
            photography: "FOTOGRAFIA",
            travels: "PODRÓŻE",
            architecture: "ARCHITEKTURA",
            memories: "WSPOMNIENIA",
            homeText: "Odkryj świat Karola – badania nad AI, modernistyczna architektura i fotografie z podróży.",
            homeTitle: "Witaj",
            workTitle: "O Karolu",
            workText: "Badania AI w obszarze uczenia głębokiego i przetwarzania języka naturalnego, ze szczególnym uwzględnieniem reprezentacji tekstów, transfer learningu oraz optymalizacji sieci neuronowych.",
            galleryTitle: "Galeria zdjęć",
            familyTitle: "Rodzina i Wydarzenia",
            showAll: "Pokaż wszystkie zdjęcia",
            noPhotos: "Brak zdjęć w tej kategorii.",
            loadingWork: "Ładowanie treści pracy…",
            workLoadError: "Nie można załadować treści pracy. Odśwież stronę.",
            docTitle: "Karol Grzegorczyk Fotografia",
            memoriesTitle: "Wspomnienia",
            contactLead: "Jeśli chcesz coś dodać lub zapytać o Karola, napisz:"
        }
    }[lang];

    // MENU (SAFE CHECKS)
    const menuHome = document.getElementById("menuHome");
    const menuFamily = document.getElementById("menuFamily");
    const menuWork = document.getElementById("menuWork");
    const menuPhotography = document.getElementById("menuPhotography");
    const menuMemories = document.getElementById("menuWspomnienia");
    const tabTravels = document.getElementById("tabTravels");
    const tabArchitecture = document.getElementById("tabArchitecture");

    if (menuHome) menuHome.innerText = t.home;
    if (menuFamily) menuFamily.innerText = t.family;
    if (menuWork) menuWork.innerText = t.work;
    if (menuPhotography) menuPhotography.innerText = t.photography;
    if (menuMemories) menuMemories.innerText = t.memories;
    if (tabTravels) tabTravels.innerText = t.travels;
    if (tabArchitecture) tabArchitecture.innerText = t.architecture;
    if (t.docTitle) document.title = t.docTitle;

    // TEXT CONTENT
    const homeTitle = document.getElementById("homeTitle");
    const homeText = document.getElementById("homeText");
    const workTitle = document.getElementById("workTitle");
    const workText = document.getElementById("workText");
    const galleryTitle = document.getElementById("galleryTitle");
    const familyTitle = document.getElementById("familyTitle");
    const memoriesTitle = document.getElementById("wspominieniaTitle");
    const globalContact = document.getElementById("globalContact");
    const memoryContainer = document.querySelector(".memories-container");

    if (homeTitle) homeTitle.innerText = t.homeTitle;
    if (homeText) homeText.innerText = t.homeText;
    if (workTitle) workTitle.innerText = t.workTitle;
    if (workText) workText.innerText = t.workText;
    if (galleryTitle) galleryTitle.innerText = t.galleryTitle;
    if (familyTitle) familyTitle.innerText = t.familyTitle;
    if (memoriesTitle) memoriesTitle.innerText = t.memoriesTitle;
    if (globalContact) {
        globalContact.innerHTML = `${t.contactLead} <a href="mailto:anna.grzegorczykmm@gmail.com">anna.grzegorczykmm@gmail.com</a>`;
    }

    const memoryCards = window.MEMORY_DATA && Array.isArray(window.MEMORY_DATA[lang])
        ? window.MEMORY_DATA[lang]
        : [];

    if (memoryContainer && memoryCards.length) {
        memoryContainer.innerHTML = memoryCards.map(card => `
            <div class="memory-card">
                <h3>${card.title}</h3>
                <div class="memory-content">
                    <p>${card.text}</p>
                </div>
            </div>
        `).join('');
    }

    // BUTTON ACTIVE STATE
    document.querySelectorAll("#langSwitch button").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.lang === lang) {
            btn.classList.add("active");
        }
    });

    // gallery labels
    window.GALLERY_LABELS = window.GALLERY_LABELS || {};
    window.GALLERY_LABELS.showAll = t.showAll;
    window.GALLERY_LABELS.noPhotos = t.noPhotos;

    document.querySelectorAll('.gallery-show-more').forEach(btn => {
        const total = btn.dataset.total;
        const label = window.GALLERY_LABELS.showAll || 'Show all photos';
        btn.innerText = total ? `${label} (${total})` : label;
    });

    // current language state
    window.currentLang = lang;

    if (window.renderGallery && window.GALLERY_DATA) {
        if (window.GALLERY_DATA.family) {
            window.renderGallery("family-gallery", window.GALLERY_DATA.family);
        }

        const activeCategory = document.querySelector('.tab-btn.active')?.dataset.category || 'travels';
        if (window.GALLERY_DATA[activeCategory]) {
            window.renderGallery(`${activeCategory}-category`, window.GALLERY_DATA[activeCategory]);
        }

        if (window.CUSTOM_LIGHTBOX) {
            window.CUSTOM_LIGHTBOX.collectGalleryAnchors();
        }
    }
};