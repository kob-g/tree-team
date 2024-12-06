"use strict";
(function (IVSPlayerPackage) {
    var videoElement = document.getElementById("video-player");
    var statusElement = document.getElementById("player-status");
    var backButton = document.getElementById("backButton");
    var stopButton = document.getElementById("stopStream");
    var resumeButton = document.getElementById("resumeStream");
    var channelTitle = document.getElementById("channel-title");
    var player;
    // クエリパラメータからplaybackUrlとchannelNameを取得
    var urlParams = new URLSearchParams(location.search);
    var playbackUrl = urlParams.get('playbackUrl') || '';
    var channelName = urlParams.get('channelName') || '';
    channelTitle.textContent = channelName ? "\u914D\u4FE1\u8005: ".concat(channelName) : "配信視聴";
    function initializePlayer(streamUrl) {
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
        player.addEventListener(IVSPlayerPackage.PlayerState.PLAYING, function () {
            statusElement.innerHTML = "配信中...";
            statusElement.className = "live";
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, function () {
            statusElement.innerHTML = "配信終了";
            statusElement.className = "offline";
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.READY, function () {
            statusElement.innerHTML = "準備完了";
            statusElement.className = "";
        });
        player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, function (err) {
            statusElement.innerHTML = "\u30A8\u30E9\u30FC: ".concat(err.message);
            statusElement.className = "error";
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.BUFFERING, function () {
            statusElement.innerHTML = "バッファリング中...";
            statusElement.className = "";
        });
    }
    function stopStream() {
        if (player) {
            player.pause();
            statusElement.textContent = "再生停止中";
            statusElement.className = "offline";
        }
    }
    function resumeStream() {
        if (player) {
            player.play();
            statusElement.textContent = "配信中...";
            statusElement.className = "live";
        }
    }
    backButton.onclick = function () {
        // list.html に戻る
        location.href = "list.html";
    };
    stopButton.onclick = function () {
        stopStream();
    };
    resumeButton.onclick = function () {
        resumeStream();
    };
    if (playbackUrl) {
        initializePlayer(playbackUrl);
    }
    else {
        statusElement.textContent = "再生URLが指定されていません。";
        statusElement.className = "error";
    }
})(window.IVSPlayer);
