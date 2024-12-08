document.addEventListener('DOMContentLoaded', () => {
    // 为所有位置标签添加编辑功能
    const locationTags = document.querySelectorAll('.location-tag span');
    
    locationTags.forEach(tag => {
        // 初始化时从localStorage加载保存的位置
        const savedLocation = localStorage.getItem(`location-${tag.dataset.id}`);
        if (savedLocation) {
            tag.textContent = savedLocation;
        }
        
        // 双击启用编辑
        tag.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            tag.contentEditable = true;
            tag.focus();
            
            // 添加编辑状态的样式
            tag.classList.add('editing');
            
            // 选中全部文本
            const range = document.createRange();
            range.selectNodeContents(tag);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        });

        // 失去焦点时保存
        tag.addEventListener('blur', () => {
            // 如果内容为空，恢复默认文本
            if (!tag.textContent.trim()) {
                tag.textContent = tag.dataset.default || '未知位置';
            }
            
            tag.contentEditable = false;
            tag.classList.remove('editing');
            localStorage.setItem(`location-${tag.dataset.id}`, tag.textContent);
        });

        // 按下回车时完成编辑
        tag.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                tag.blur();
            } else if (e.key === 'Escape') {
                // 按ESC取消编辑
                e.preventDefault();
                tag.textContent = localStorage.getItem(`location-${tag.dataset.id}`) || tag.dataset.default || '未知位置';
                tag.blur();
            }
        });
        
        // 防止冒泡到父元素
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}); 