// 轮播图功能
class Carousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            'image1.jpg',
            'image2.jpg',
            'image3.jpg'
        ];
        
        this.initCarousel();
    }

    initCarousel() {
        const carouselInner = document.querySelector('.carousel-inner');
        const dotsContainer = document.querySelector('.carousel-dots');

        // 添加图片
        this.slides.forEach((slide, index) => {
            const img = document.createElement('img');
            img.src = slide;
            img.style.display = index === 0 ? 'block' : 'none';
            carouselInner.appendChild(img);

            // 添加指示点
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });

        // 绑定按钮事件
        document.querySelector('.prev').addEventListener('click', () => this.changeSlide(-1));
        document.querySelector('.next').addEventListener('click', () => this.changeSlide(1));
    }

    changeSlide(direction) {
        const images = document.querySelectorAll('.carousel-inner img');
        const dots = document.querySelectorAll('.dot');

        images[this.currentSlide].style.display = 'none';
        dots[this.currentSlide].classList.remove('active');

        this.currentSlide = (this.currentSlide + direction + this.slides.length) % this.slides.length;

        images[this.currentSlide].style.display = 'block';
        dots[this.currentSlide].classList.add('active');
    }
}

// 聊天功能
class Chat {
    constructor() {
        this.messages = [];
        this.initChat();
    }

    initChat() {
        const sendBtn = document.querySelector('.send-btn');
        const textarea = document.querySelector('.chat-input textarea');

        sendBtn.addEventListener('click', () => this.sendMessage(textarea.value));
        textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage(textarea.value);
            }
        });
    }

    sendMessage(content) {
        if (!content.trim()) return;

        const messagesContainer = document.querySelector('.chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');
        messageElement.textContent = content;
        messagesContainer.appendChild(messageElement);

        // 清空输入框
        document.querySelector('.chat-input textarea').value = '';
        
        // 这里可以添加AI回复的逻辑
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
    new Chat();

    // 微信二维码弹窗
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
}); 