interface Window {
  IVSPlayer: any;
}

(function (IVSPlayerPackage: any) {
  const videoElement = document.getElementById("video-player") as HTMLVideoElement;
  const statusElement = document.getElementById("player-status") as HTMLElement;
  const playButton = document.getElementById("play") as HTMLButtonElement;
  const stopButton = document.getElementById("stop") as HTMLButtonElement;
  let player: any;
  let checkStreamInterval: number;

  // 再生URLを定数として定義
  const PLAYBACK_URL: string = "https://a140495bb918.ap-northeast-1.playback.live-video.net/api/video/v1/ap-northeast-1.495599775160.channel.vtU6skTfHUxS.m3u8";

  // ユーザーのクリック後に AudioContext を再開
  document.addEventListener('click', () => {
      if (typeof AudioContext !== 'undefined') {
          const audioCtx = new AudioContext();
          if (audioCtx.state === 'suspended') {
              audioCtx.resume();
          }
      }
  }, { once: true });

  // プレイヤーの初期化
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
          playButton.disabled = true;
          stopButton.disabled = false;
          clearInterval(checkStreamInterval); // ストリームチェック停止
      });

      player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, () => {
          statusElement.innerHTML = "配信終了";
          statusElement.className = "offline";
          playButton.disabled = false;
          stopButton.disabled = true;
      });

      player.addEventListener(IVSPlayerPackage.PlayerState.READY, () => {
          statusElement.innerHTML = "準備完了";
          statusElement.className = "";
      });

      player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, (err: any) => {
          statusElement.innerHTML = `エラー: ${err.message}`;
          statusElement.className = "error";
          playButton.disabled = false;
          stopButton.disabled = true;
      });

      player.addEventListener(IVSPlayerPackage.PlayerState.BUFFERING, () => {
          statusElement.innerHTML = "バッファリング中...";
          statusElement.className = "";
      });
  }

  // ストリームの読み込み
  function loadStream(): void {
      const streamUrl = PLAYBACK_URL;
      if (!streamUrl) {
          alert("ストリームURLが設定されていません。");
          return;
      }
      if (player) {
          player.detachHTMLVideoElement();
          player.delete();
      }
      initializePlayer(streamUrl);
  }

  // ストリームの停止
  function stopStream(): void {
      if (player) {
          player.pause();
          player.detachHTMLVideoElement();
          player.delete();
          player = null;
          statusElement.textContent = "配信停止中";
          statusElement.className = "offline";
          playButton.disabled = false;
          stopButton.disabled = true;
      }
  }

  // ストリームの存在をチェックする関数
  async function checkStream(): Promise<void> {
      try {
          const response = await fetch(PLAYBACK_URL, { method: 'HEAD' });
          if (response.ok) {
              statusElement.textContent = "配信が開始されました。再生を開始します...";
              loadStream();
              clearInterval(checkStreamInterval);
          }
      } catch (error) {
          console.log("ストリームがまだ開始されていません。");
      }
  }

  // 初期化関数
  async function init(): Promise<void> {
      try {
          playButton.addEventListener("click", loadStream);
          stopButton.addEventListener("click", stopStream);

          // 配信が開始されているか定期的にチェック（例: 10秒ごと）
          checkStreamInterval = window.setInterval(checkStream, 10000);
      } catch (err) {
          console.error(err);
          statusElement.textContent = "エラーが発生しました。";
      }
  }

  // ページロード時に初期化
  window.addEventListener("load", init);

  // グローバルスコープに関数を公開
  (window as any).loadStream = loadStream;
  (window as any).stopStream = stopStream;

})(window.IVSPlayer);
