// 代表引用来自网络相关的文案
fetch('https://v1.hitokoto.cn/?j=k')
    .then(response => response.json())
    .then(data => {
        const hitokoto = document.getElementById('hitokoto_text');
        hitokoto.innerText = data.hitokoto;
    });



// 阅读下载
 // 安全内容处理 
        const sanitizeHTML = str => {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };
		
 
        // 动态构建说明面板 
        const renderReleaseNotes = bodyText => {
            const container = document.createElement('div');
            container.className = 'release-body';
            container.innerHTML = `      
                <i>注意：${sanitizeHTML(bodyText)}</i>
            `;
            document.getElementById('release-notes').appendChild(container);
        };
 
        // 数据处理器 
        const processReleaseData = data => {
            document.title = document.title.replace('{{version}}', data.tag_name);
            if (data.body) renderReleaseNotes(data.body);
 
            const fragment = document.createDocumentFragment();
            data.assets.forEach(asset => {
                const card = document.createElement('div');
                card.className = 'download-item';
                card.innerHTML = `
                    <h2 style="font-size: 18px; text-align: center; color: #FFD700;">${sanitizeHTML(/releaseA/.test(asset.name) ? '📦 共存版' : '🌟 测试版')}</h2>
                    <p>▸ 版本：<code>${sanitizeHTML(data.name.replace(/.*?_([\d.]+)/, '$1'))}</code></p>
                    <p>▸ 大小：${(asset.size / 1024 / 1024).toFixed(1)} MB</p>
                    <p>▸ 更新：${new Date(asset.updated_at).toLocaleString('zh-CN', { 
                        timeZone: 'Asia/Shanghai',
                        hour12: false 
                    })}</p>
                    <p>▸ 下载：${asset.download_count.toLocaleString()} 次</p>
                    <a href="https://gh-proxy.ygxz.in/${asset.browser_download_url}" 
                       class="download-button" 
                       download="${asset.name}">
                        ⬇️ 立即下载 
                    </a>
                `;
                fragment.appendChild(card);
            });
            
            document.getElementById('download-list').innerHTML = '';
            document.getElementById('download-list').appendChild(fragment);
        };
 
        // 数据请求 
        fetch('https://api.github.com/repos/gedoor/legado/releases/tags/beta')
            .then(response => {
                if (!response.ok) throw new Error(`[${response.status}] 数据获取失败`);
                return response.json();
            })
            .then(processReleaseData)
            .catch(error => {
                document.getElementById('download-list').innerHTML = `
                    <div class="error">
                        ❌ 加载失败：${sanitizeHTML(error.message)}<br><br>
                        <button onclick="window.location.reload()" 
                                style="padding:12px 24px;margin-top:1rem;">
                            🔄 点击重试 
                        </button>
                    </div>
                `;
            });
