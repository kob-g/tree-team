// ストリームキーとエンドポイントの設定
const STREAM_KEY = "sk_ap-northeast-1_x22iY0SkaCPV_Ezbc5fDMdmyDtOxbZWNgnqHcTQfJKM";
const INGEST_ENDPOINT = "a140495bb918.global-contribute.live-video.net";

// チャンネル設定の定義（低レイテンシー）
const channelConfigs = [
    ["Basic: Landscape", window.IVSBroadcastClient.BASIC_LANDSCAPE],
    ["Basic: Portrait", window.IVSBroadcastClient.BASIC_PORTRAIT],
    ["Standard: Landscape", window.IVSBroadcastClient.STANDARD_LANDSCAPE],
    ["Standard: Portrait", window.IVSBroadcastClient.STANDARD_PORTRAIT]
];

// 初期設定
const config = {
    ingestEndpoint: INGEST_ENDPOINT,
    streamConfig: window.IVSBroadcastClient.BASIC_LANDSCAPE, // 低レイテンシー設定
    logLevel: window.IVSBroadcastClient.LOG_LEVEL.DEBUG
};

// エラーハンドリング
function clearError() {
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = "";
}

function setError(message) {
    if (Array.isArray(message)) {
        message = message.join("<br/>");
    }
    const errorEl = document.getElementById("error");
    errorEl.innerHTML = message;
}

// デバイス取得
async function getDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === "videoinput");
        const audioDevices = devices.filter(d => d.kind === "audioinput");

        if (!videoDevices.length) {
            setError("ビデオデバイスが見つかりません。");
        }
        if (!audioDevices.length) {
            setError("オーディオデバイスが見つかりません。");
        }

        return { videoDevices, audioDevices };
    } catch (error) {
        setError("デバイスの取得に失敗しました。");
        console.error(error);
        return { videoDevices: [], audioDevices: [] };
    }
}

// デバイス選択の初期化
async function initializeDeviceSelect() {
    const videoSelectEl = document.getElementById("video-devices");
    const audioSelectEl = document.getElementById("audio-devices");

    const { videoDevices, audioDevices } = await getDevices();
    videoDevices.forEach((device, index) => {
        videoSelectEl.options[index] = new Option(device.label || `カメラ ${index + 1}`, device.deviceId);
    });

    audioSelectEl.options[0] = new Option("None", "None");
    audioDevices.forEach((device, index) => {
        audioSelectEl.options[index + 1] = new Option(device.label || `マイク ${index + 1}`, device.deviceId);
    });

    videoSelectEl.disabled = false;
    audioSelectEl.disabled = false;
}

// クライアントの作成
async function createClient() {
    if (window.client) {
        window.client.delete();
    }

    window.client = window.IVSBroadcastClient.create(config);

    window.client.on(
        window.IVSBroadcastClient.BroadcastClientEvents.ACTIVE_STATE_CHANGE,
        (active) => {
            onActiveStateChange(active);
        }
    );

    const previewEl = document.getElementById("preview");
    window.client.attachPreview(previewEl);

    await handleVideoDeviceSelect();
    await handleAudioDeviceSelect();
}

// ビデオデバイスの処理
async function handleVideoDeviceSelect() {
    const id = "camera";
    const videoSelectEl = document.getElementById("video-devices");
    const { videoDevices } = await getDevices();
    if (window.client.getVideoInputDevice(id)) {
        window.client.removeVideoInputDevice(id);
    }

    const selectedDevice = videoDevices.find(device => device.deviceId === videoSelectEl.value);
    const deviceId = selectedDevice ? selectedDevice.deviceId : null;
    const { width, height } = config.streamConfig.maxResolution;
    const cameraStream = await getCamera(deviceId, width, height);

    await window.client.addVideoInputDevice(cameraStream, id, { index: 0 });
}

// マイクデバイスの処理
async function handleAudioDeviceSelect() {
    const id = "microphone";
    const audioSelectEl = document.getElementById("audio-devices");
    const { audioDevices } = await getDevices();
    if (window.client.getAudioInputDevice(id)) {
        window.client.removeAudioInputDevice(id);
    }

    if (audioSelectEl.value.toLowerCase() === "none") return;

    const selectedDevice = audioDevices.find(device => device.deviceId === audioSelectEl.value);
    if (selectedDevice) {
        try {
            const microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedDevice.deviceId }
            });
            await window.client.addAudioInputDevice(microphoneStream, id);
        } catch (error) {
            setError("マイクの取得に失敗しました。");
            console.error(error);
        }
    }
}

// カメラストリームの取得
async function getCamera(deviceId, maxWidth, maxHeight) {
    let media;
    const videoConstraints = {
        deviceId: deviceId ? { exact: deviceId } : undefined,
        width: { max: maxWidth },
        height: { max: maxHeight }
    };
    try {
        media = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: true
        });
    } catch (e) {
        // 幅と高さの制約を削除して再試行
        delete videoConstraints.width;
        delete videoConstraints.height;
        try {
            media = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints
            });
        } catch (error) {
            setError("カメラストリームの取得に失敗しました。");
            console.error(error);
        }
    }
    return media;
}

// フォームのバリデーション（必要なくなるため簡略）
function validate() {
    // 自動設定のため空
    return [];
}

function handleValidationErrors(errors, doNotDisplay) {
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");

    clearError();
    if (errors && errors.length) {
        if (!doNotDisplay) {
            setError(errors);
        }
        start.disabled = true;
        stop.disabled = true;
        return;
    }

    start.disabled = false;
}

// 配信開始
async function startBroadcast() {
    const start = document.getElementById("start");
    const stop = document.getElementById("stop");

    try {
        start.disabled = true;
        await window.client.startBroadcast(STREAM_KEY, config.ingestEndpoint);
        stop.disabled = false;
    } catch (err) {
        start.disabled = false;
        setError(err.toString());
    }
}

// 配信停止
async function stopBroadcast() {
    try {
        await window.client.stopBroadcast();
        const start = document.getElementById("start");
        const stop = document.getElementById("stop");
        start.disabled = false;
        stop.disabled = true;
    } catch (err) {
        setError(err.toString());
    }
}

// 配信状態の変更ハンドラー
function onActiveStateChange(active) {
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const statusEl = document.getElementById("broadcast-status");
    // stream-configは使わないため、一旦コメントアウト
    // const streamConfigSelectEl = document.getElementById("stream-config");
    // const inputEl = document.getElementById("stream-key");
    // inputEl.disabled = active;
  start.disabled = active;
  stop.disabled = !active;
    // streamConfigSelectEl.disabled = active;

  if (active) {
      statusEl.textContent = "配信中";
  } else {
      statusEl.textContent = "配信停止中";
  }
}

// ユーザーのクリック後に AudioContext を再開
document.addEventListener('click', () => {
    if (typeof AudioContext !== 'undefined') {
        const audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
}, { once: true });

// 初期化関数
async function init() {
    try {
        const videoSelectEl = document.getElementById("video-devices");
        const audioSelectEl = document.getElementById("audio-devices");

        await initializeDeviceSelect();

        videoSelectEl.addEventListener("change", handleVideoDeviceSelect, true);
        audioSelectEl.addEventListener("change", handleAudioDeviceSelect, true);

        config.streamConfig = channelConfigs[0][1]; // "Basic: Landscape"

        await createClient();
        await initializeDeviceSelect();

        handleValidationErrors(validate(), true);
    } catch (err) {
        setError(err.message);
    }
}

// ページロード時に初期化
window.addEventListener("load", init);
