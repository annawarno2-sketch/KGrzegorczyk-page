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

    window.openMemoryModal = function (title, text) {
        heading.innerText = title;
        content.innerText = text;
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
            const text = card.querySelector('.memory-content')?.innerText || card.querySelector('p')?.innerText || '';
            window.openMemoryModal(title, text);
        });
    } else {
        console.warn('No memory container found for modal wiring');
    }

});