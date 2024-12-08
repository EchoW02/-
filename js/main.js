import { Chat } from './chat.js';
import { initModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
    window.chatInstance = new Chat();
    initModal();
}); 