export class Chat {
    constructor() {
        this.messages = [];
        this.conversationHistory = [
            {
                role: "system",
                content: "你是一个专业、友好的AI助手，可以帮助用户解答各种问题。"
            }
        ];
        this.currentChatId = Date.now();
        this.initChat();
    }

    initChat() {
        // 获取DOM元素
        this.messagesContainer = document.querySelector('.chat-messages');
        this.textarea = document.querySelector('.chat-input textarea');
        this.sendBtn = document.querySelector('.send-btn');
        this.newChatBtn = document.querySelector('.new-chat-btn');
        this.historyContainer = document.querySelector('.chat-history');

        // 绑定事件
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.newChatBtn.addEventListener('click', () => this.createNewChat());

        // 自动调整文本框高度
        this.textarea.addEventListener('input', () => {
            this.textarea.style.height = 'auto';
            this.textarea.style.height = this.textarea.scrollHeight + 'px';
        });
    }

    async sendMessage() {
        const content = this.textarea.value.trim();
        if (!content) return;

        // 添加用户消息到历史记录
        this.conversationHistory.push({
            role: "user",
            content: content
        });

        // 添加用户消息到界面
        this.addMessage('user', content);
        this.textarea.value = '';
        this.textarea.style.height = 'auto';

        // 显示AI正在输入的状态
        this.addTypingIndicator();

        try {
            const response = await this.getAIResponse(content);
            this.removeTypingIndicator();
            
            // 添加AI响应到历史记录
            this.conversationHistory.push({
                role: "assistant",
                content: response
            });

            // 添加AI响应到界面
            this.addMessage('ai', response);
        } catch (error) {
            this.removeTypingIndicator();
            this.addMessage('ai', '抱歉，出现了一些错误，请稍后再试。');
        }

        this.saveToHistory();
    }

    addMessage(type, content) {
        const time = new Date().toLocaleTimeString();
        const messageHTML = `
            <div class="message ${type}-message">
                <div class="message-content">${this.formatMessage(content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        this.messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
        this.messages.push({ type, content, time });
    }

    formatMessage(content) {
        // 简单的文本格式化，可以根据需要扩展
        return content.replace(/\n/g, '<br>');
    }

    addTypingIndicator() {
        const typingHTML = `
            <div class="message ai-message typing">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        this.messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = this.messagesContainer.querySelector('.typing');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async getAIResponse(message) {
        const API_URL = 'https://qianfan.baidubce.com/v2/chat/completions';
        const ACCESS_TOKEN = 'your_access_token';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                },
                body: JSON.stringify({
                    model: "ernie-3.5-8k",
                    messages: this.conversationHistory,
                    stream: false,
                    temperature: 0.7,
                    top_p: 0.8
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                const aiResponse = data.choices[0].message.content;
                return aiResponse;
            } else {
                throw new Error('No response from AI');
            }
        } catch (error) {
            console.error('Error calling AI API:', error);
            return "抱歉，我现在无法回答您的问题。请稍后再试。";
        }
    }

    createNewChat() {
        this.currentChatId = Date.now();
        this.messages = [];
        this.conversationHistory = [
            {
                role: "system",
                content: "你是一个专业、友好的AI助手，可以帮助用户解答各种问题。"
            }
        ];
        this.messagesContainer.innerHTML = '';
        this.addMessage('ai', '你好！我是AI助手，有什么我可以帮你的吗？');
        this.updateHistoryUI();
    }

    saveToHistory() {
        // 保存当前对话到历史记录
        const existingChat = this.history.find(chat => chat.id === this.currentChatId);
        if (existingChat) {
            existingChat.messages = this.messages;
        } else {
            this.history.push({
                id: this.currentChatId,
                title: this.messages[0]?.content.slice(0, 20) + '...',
                messages: this.messages
            });
        }
        this.updateHistoryUI();
    }

    updateHistoryUI() {
        this.historyContainer.innerHTML = this.history.map(chat => `
            <div class="history-item ${chat.id === this.currentChatId ? 'active' : ''}" 
                 data-chat-id="${chat.id}">
                <span class="history-title">${chat.title || '新对话'}</span>
                <button class="delete-chat" data-chat-id="${chat.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // 绑定历史记录点击事件
        this.historyContainer.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-chat')) {
                    this.loadChat(parseInt(item.dataset.chatId));
                }
            });
        });

        // 绑定删除按钮事件
        this.historyContainer.querySelectorAll('.delete-chat').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChat(parseInt(btn.dataset.chatId));
            });
        });
    }

    loadChat(chatId) {
        const chat = this.history.find(chat => chat.id === chatId);
        if (chat) {
            this.currentChatId = chatId;
            this.messages = chat.messages;
            this.messagesContainer.innerHTML = '';
            chat.messages.forEach(msg => {
                this.addMessage(msg.type, msg.content);
            });
            this.updateHistoryUI();
        }
    }

    deleteChat(chatId) {
        this.history = this.history.filter(chat => chat.id !== chatId);
        if (this.currentChatId === chatId) {
            this.createNewChat();
        }
        this.updateHistoryUI();
    }
} 