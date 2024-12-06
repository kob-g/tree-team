interface Window {
    IVSPlayer: any;
}

(function (IVSPlayerPackage: any) {
    const videoElement = document.getElementById("video-player") as HTMLVideoElement;
    const statusElement = document.getElementById("player-status") as HTMLElement;
    const backButton = document.getElementById("backButton") as HTMLButtonElement;
    const stopButton = document.getElementById("stopStream") as HTMLButtonElement;
    const resumeButton = document.getElementById("resumeStream") as HTMLButtonElement;
    const channelTitle = document.getElementById("channel-title") as HTMLElement;

    let player: any;

    // クエリパラメータからplaybackUrlとchannelNameを取得
    const urlParams = new URLSearchParams(location.search);
    const playbackUrl = urlParams.get('playbackUrl') || '';
    const channelName = urlParams.get('channelName') || '';

    channelTitle.textContent = channelName ? `配信者: ${channelName}` : "配信視聴";

    function initializePlayer(streamUrl: string): void {
        if (!IVSPlayerPackage.isPlayerSupported) {
            statusElement.innerHTML = "このブラウザはIVSプレーヤーをサポートしていません。";
            statusElement.className = "error";
            return;
        }

        player = IVSPlayerPackage.create();
        player.attachHTMLVideoElement(videoElement);
        player.load(streamUrl);
        player.setAutoplay(true);
        player.setVolume(0.5);

        player.addEventListener(IVSPlayerPackage.PlayerState.PLAYING, () => {
            statusElement.innerHTML = "配信中...";
            statusElement.className = "live";
        });

        player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, () => {
            statusElement.innerHTML = "配信終了";
            statusElement.className = "offline";
        });

        player.addEventListener(IVSPlayerPackage.PlayerState.READY, () => {
            statusElement.innerHTML = "準備完了";
            statusElement.className = "";
        });

        player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, (err: any) => {
            statusElement.innerHTML = `エラー: ${err.message}`;
            statusElement.className = "error";
        });

        player.addEventListener(IVSPlayerPackage.PlayerState.BUFFERING, () => {
            statusElement.innerHTML = "バッファリング中...";
            statusElement.className = "";
        });
    }

    function stopStream(): void {
        if (player) {
            player.pause();
            statusElement.textContent = "再生停止中";
            statusElement.className = "offline";
        }
    }

    function resumeStream(): void {
        if (player) {
            player.play();
            statusElement.textContent = "配信中...";
            statusElement.className = "live";
        }
    }

    backButton.onclick = () => {
        // list.html に戻る
        location.href = "list.html";
    };

    stopButton.onclick = () => {
        stopStream();
    };

    resumeButton.onclick = () => {
        resumeStream();
    };

    if (playbackUrl) {
        initializePlayer(playbackUrl);
    } else {
        statusElement.textContent = "再生URLが指定されていません。";
        statusElement.className = "error";
    }

})(window.IVSPlayer);
