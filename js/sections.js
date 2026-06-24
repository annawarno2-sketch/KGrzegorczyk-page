let workSectionLoaded = false;

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(id);
    if (section) {
        section.classList.add('active');
    }

    if (id === 'work') {
        loadWorkSection();
    }
}

function loadWorkSection() {
    if (workSectionLoaded) {
        return;
    }
    const container = document.getElementById('work-content');
    if (!container) {
        return;
    }

    const workLoadingText = (window.GALLERY_LABELS && window.GALLERY_LABELS.loadingWork) ? window.GALLERY_LABELS.loadingWork : 'Loading work content…';
    container.innerHTML = `<p>${workLoadingText}</p>`;

    fetch('work.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load work content: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.innerHTML = html;
            workSectionLoaded = true;
            if (window.currentLang && typeof window.setLang === 'function') {
                window.setLang(window.currentLang);
            }
        })
        .catch(error => {
            console.warn('Fetch work.html failed, falling back to work-content.js', error);
            if (window.WORK_CONTENT) {
                container.innerHTML = window.WORK_CONTENT;
                workSectionLoaded = true;
                if (window.currentLang && typeof window.setLang === 'function') {
                    window.setLang(window.currentLang);
                }
            } else {
                const fallbackText = (window.GALLERY_LABELS && window.GALLERY_LABELS.workLoadError) ? window.GALLERY_LABELS.workLoadError : 'Unable to load work content. Please refresh the page.';
                container.innerHTML = `<p>${fallbackText}</p>`;
            }
        });
}