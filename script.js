function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    document.querySelector('.time').textContent = timeString;
}

// 使用 requestAnimationFrame 代替 setInterval
function animateTime() {
    updateTime();
    requestAnimationFrame(animateTime);
}



animateTime();

let currentSpeed = Math.floor(Math.random() * 100) + 1;

function updateDataSpeed() {
    // 随机增加或减少速度，幅度在 1-5 之间
    const change = Math.floor(Math.random() * 5) + 1;
    const isIncrease = Math.random() > 0.5;
    currentSpeed = isIncrease ? currentSpeed + change : currentSpeed - change;
    if (currentSpeed < 1) currentSpeed = 1;
    document.querySelector('.data-speed').textContent = `${currentSpeed} kb/s`;
}

setInterval(updateDataSpeed, 2000);

// 代表引用来自网络相关的文案
fetch('https://v1.hitokoto.cn/?j=k')
    .then(response => response.json())
    .then(data => {
        const hitokoto = document.getElementById('hitokoto_text');
        hitokoto.innerText = data.hitokoto;
    });

// 获取要复制的文本元素
const copyText = document.getElementById('copyText');

// 点击事件处理函数
copyText.addEventListener('click', function() {
    const textToCopy = this.innerText;

    // 创建临时元素用于复制
    const tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);

    // 选中并复制内容
    tempInput.select();
    document.execCommand('copy');

    // 移除临时元素
    document.body.removeChild(tempInput);

    // 创建弹窗显示复制成功
    const successMessage = document.createElement('div');
    successMessage.classList.add('success-popup');
    successMessage.innerText = '复制成功';
    successMessage.style.position = 'fixed';
    successMessage.style.top = '10px';
    successMessage.style.width = 'fit-content';
    successMessage.style.zIndex = '9999';
    successMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    successMessage.style.color = 'white';
    successMessage.style.textAlign = 'center';
    document.body.appendChild(successMessage);

    // 2 秒后自动关闭弹窗
    setTimeout(() => {
        document.body.removeChild(successMessage);
    }, 2000);
});

const prevBtn = document.getElementById('prev-btn');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const nextBtn = document.getElementById('next-btn');
        const songTitle = document.querySelector('.song-title');
        const artistName = document.querySelector('.artist-name');
        const albumArt = document.querySelector('.album-art');
        const progressBar = document.querySelector('.progress-bar');
        const progress = document.querySelector('.progress');

        let currentSongIndex = 0;
        let songs = [];
        let audio = new Audio();
        let isPlayingByUserGesture = false;
        let playAfterLoad = false;

        async function fetchSongs() {
            try {
                const response = await fetch('https://api.obdo.cc/meting/handsome.php?type=playlist&id=12639909554');
                const data = await response.json();
                return data.map(item => ({
                    title: item.name,
                    artist: item.artist,
                    url: item.url,
                    coverUrl: item.cover
                }));
            } catch (error) {
                console.error('Error fetching songs:', error);
                return [];
            }
        }

        async function loadRandomSong() {
            if (songs.length === 0) {
                songs = await fetchSongs();
            }
            const randomIndex = Math.floor(Math.random() * songs.length);
            const songData = songs[randomIndex];
            songTitle.textContent = songData.title;
            artistName.textContent = songData.artist;
            // 设置 albumArt 的 src 可能需要根据实际情况调整
            albumArt.src = songData.coverUrl;
            audio.src = songData.url;
            if (isPlayingByUserGesture || playAfterLoad) {
                audio.play();
                playAfterLoad = false;
            }
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
const timeDisplay = document.getElementById('time-display-id'); // 这里的 'time-display-id' 应该替换为实际的 HTML 元素的 id

        prevBtn.addEventListener('click', () => {
            if (currentSongIndex > 0) {
                currentSongIndex--;
            } else {
                currentSongIndex = songs.length - 1;
            }
            loadRandomSong();
            if (!audio.paused) {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });

        nextBtn.addEventListener('click', () => {
            currentSongIndex++;
            if (currentSongIndex === songs.length) {
                currentSongIndex = 0;
            }
            loadRandomSong();
            if (!audio.paused) {
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }
        });

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                isPlayingByUserGesture = true;
                audio.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        // 当音乐播放结束时，自动播放下一首
        audio.addEventListener('ended', () => {
            nextBtn.click();
        });

        loadRandomSong();

        // 当音乐播放时，开始旋转动画
        audio.addEventListener('play', () => {
            albumArt.style.animation = 'rotate 20s linear infinite';
        });

        // 当音乐暂停时，停止旋转动画并保留暂停时的状态
        audio.addEventListener('pause', () => {
            albumArt.style.animationPlayState = 'paused';
        });

        // 更新进度条和时间显示
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = progressPercent + '%';
            updateTimeDisplay();
        });

        function updateTimeDisplay() {
            const currentTime = formatTime(audio.currentTime);
            const duration = formatTime(audio.duration);
            // 假设存在 timeDisplay 元素
            timeDisplay.textContent = `${currentTime} / ${duration}`;
        }

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10? '0' : ''}${seconds}`;
        }

        // 获取列表按钮元素
        const listBtn = document.getElementById('list-btn');

        // 为列表按钮添加点击事件
        listBtn.addEventListener('click', () => {
            // 创建弹窗元素
            const popup = document.createElement('div');
            popup.classList.add('popup');

            // 假设您有一个关闭按钮的图片路径 'closeButton.png'
            const closeButton = new Image();
            closeButton.src = 'images/closeButton.png';
            closeButton.classList.add('close-btn');
            popup.appendChild(closeButton);

            document.body.appendChild(popup);

            // 填充歌曲列表
            songs.forEach(song => {
                const songItem = document.createElement('div');
                songItem.classList.add('song-item');
                songItem.textContent = `${song.title} - ${song.artist}`;
                songItem.addEventListener('click', () => {
                    // 选择歌曲时的操作
                    currentSongIndex = songs.indexOf(song);
                    loadSelectedSong(song);
                    popup.remove(); // 关闭弹窗
                    audio.play(); // 直接播放选中的歌曲
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                });
                popup.appendChild(songItem);
            });

            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭';
            closeBtn.addEventListener('click', () => {
                popup.style.opacity = '0';
                setTimeout(() => {
                    popup.remove();
                }, 300);
            });
            popup.appendChild(closeBtn);

            // 将弹窗添加到页面
            document.body.appendChild(popup);
            setTimeout(() => {
                popup.style.opacity = '1';
            }, 10);
        });

        function loadSelectedSong(song) {
            songTitle.textContent = song.title;
            artistName.textContent = song.artist;
            // 设置 albumArt 的 src 可能需要根据实际情况调整
            albumArt.src = song.coverUrl;
            audio.src = song.url;
        }


// 发送请求获取 IP 并获取位置信息
function getAndShowLocation() {
    fetch('http://res.abeim.cn/api-ip_get?export=json')
        .then(response => response.json())
        .then(data => {
            // 提取 IP 地址
            const ip = data.ip;
            // 发送 IP 到获取位置的接口
            fetch(`https://collect.xmwxxc.com/collect/address/?ip=${ip}`)
                .then(response => response.text())
                .then(data => {
                    // 解析返回的字符串，提取城市市区部分
                    const locationStr = data;
                    const start = locationStr.indexOf('你当前的位置:') + '你当前的位置:'.length;
                    // 找到逗号的位置，即城市部分的结束位置
                    const end = locationStr.indexOf(',', start);
                    // 提取城市部分
                    const city = locationStr.substring(start, end);
                    // 只保留前六位
                    const cityFirstSix = city.substring(0, 6);
                    // 在页面上显示城市市区
                    document.getElementById('location').innerHTML = cityFirstSix;
                })
                .catch(error => {
                    console.error('获取位置数据时出错:', error);
                });
        })
        .catch(error => {
            console.error('获取 IP 时出错:', error);
        });
}

getAndShowLocation();