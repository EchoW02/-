export function initModal() {
    const wechatLink = document.querySelector('.wechat');
    const modal = document.querySelector('.qr-modal');
    const closeBtn = document.querySelector('.close-modal');

    wechatLink.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
} 