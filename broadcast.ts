// ストリームキーとエンドポイントの設定
const STREAM_KEY: string = "sk_ap-northeast-1_x22iY0SkaCPV_Ezbc5fDMdmyDtOxbZWNgnqHcTQfJKM";
const INGEST_ENDPOINT: string = "a140495bb918.global-contribute.live-video.net";

// チャンネル設定の定義（低レイテンシー）
type ChannelConfig = [string, any];

const channelConfigs: ChannelConfig[] = [
    ["Basic: Landscape", (window as any).IVSBroadcastClient.BASIC_LANDSCAPE],
    ["Basic: Portrait", (window as any).IVSBroadcastClient.BASIC_PORTRAIT],
    ["Standard: Landscape", (window as any).IVSBroadcastClient.STANDARD_LANDSCAPE],
    ["Standard: Portrait", (window as any).IVSBroadcastClient.STANDARD_PORTRAIT]
];

// 初期設定
interface Config {
    ingestEndpoint: string;
    streamConfig: any;
    logLevel: any;
}

const config: Config = {
    ingestEndpoint: INGEST_ENDPOINT,
    streamConfig: (window as any).IVSBroadcastClient.BASIC_LANDSCAPE, // 低レイテンシー設定
    logLevel: (window as any).IVSBroadcastClient.LOG_LEVEL.DEBUG
};

// エラーハンドリング
function clearError(): void {
    const errorEl = document.getElementById("error");
    if (errorEl) {
        errorEl.innerHTML = "";
    }
}

function setError(message: string | string[]): void {
    if (Array.isArray(message)) {
        message = message.join("<br/>");
    }
    const errorEl = document.getElementById("error");
    if (errorEl) {
        errorEl.innerHTML = message;
    }
}

// デバイス取得
async function getDevices(): Promise<{ videoDevices: MediaDeviceInfo[]; audioDevices: MediaDeviceInfo[] }> {
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
async function initializeDeviceSelect(): Promise<void> {
    const videoSelectEl = document.getElementById("video-devices") as HTMLSelectElement;
    const audioSelectEl = document.getElementById("audio-devices") as HTMLSelectElement;

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
async function createClient(): Promise<void> {
    if ((window as any).client) {
        (window as any).client.delete();
    }

    (window as any).client = (window as any).IVSBroadcastClient.create(config);

    (window as any).client.on(
        (window as any).IVSBroadcastClient.BroadcastClientEvents.ACTIVE_STATE_CHANGE,
        (active: boolean) => {
            onActiveStateChange(active);
        }
    );

    const previewEl = document.getElementById("preview") as HTMLVideoElement;
    (window as any).client.attachPreview(previewEl);

    await handleVideoDeviceSelect();
    await handleAudioDeviceSelect();
}

// ビデオデバイスの処理
async function handleVideoDeviceSelect(): Promise<void> {
    const id = "camera";
    const videoSelectEl = document.getElementById("video-devices") as HTMLSelectElement;
    const { videoDevices } = await getDevices();
    if ((window as any).client.getVideoInputDevice(id)) {
        (window as any).client.removeVideoInputDevice(id);
    }

    const selectedDevice = videoDevices.find(device => device.deviceId === videoSelectEl.value);
    const deviceId = selectedDevice ? selectedDevice.deviceId : null;
    const { width, height } = config.streamConfig.maxResolution;
    const cameraStream = await getCamera(deviceId, width, height);

    await (window as any).client.addVideoInputDevice(cameraStream, id, { index: 0 });
}

// マイクデバイスの処理
async function handleAudioDeviceSelect(): Promise<void> {
    const id = "microphone";
    const audioSelectEl = document.getElementById("audio-devices") as HTMLSelectElement;
    const { audioDevices } = await getDevices();
    if ((window as any).client.getAudioInputDevice(id)) {
        (window as any).client.removeAudioInputDevice(id);
    }

    if (audioSelectEl.value.toLowerCase() === "none") return;

    const selectedDevice = audioDevices.find(device => device.deviceId === audioSelectEl.value);
    if (selectedDevice) {
        try {
            const microphoneStream = await navigator.mediaDevices.getUserMedia({
                audio: { deviceId: selectedDevice.deviceId }
            });
            await (window as any).client.addAudioInputDevice(microphoneStream, id);
        } catch (error) {
            setError("マイクの取得に失敗しました。");
            console.error(error);
        }
    }
}

// カメラストリームの取得
async function getCamera(
    deviceId: string | null,
    maxWidth: number,
    maxHeight: number
): Promise<MediaStream | undefined> {
    let media: MediaStream | undefined;
    const videoConstraints: MediaTrackConstraints = {
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
function validate(): string[] {
    // 自動設定のため空
    return [];
}

function handleValidationErrors(errors: string[], doNotDisplay?: boolean): void {
    const start = document.getElementById("start") as HTMLButtonElement;
    const stop = document.getElementById("stop") as HTMLButtonElement;

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
async function startBroadcast(): Promise<void> {
    const start = document.getElementById("start") as HTMLButtonElement;
    const stop = document.getElementById("stop") as HTMLButtonElement;

    try {
        start.disabled = true;
        await (window as any).client.startBroadcast(STREAM_KEY, config.ingestEndpoint);
        stop.disabled = false;
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.toString());
        } else {
            setError("未知のエラーが発生しました。");
        }
    }
    
}

// 配信停止
async function stopBroadcast(): Promise<void> {
    try {
        await (window as any).client.stopBroadcast();
        const start = document.getElementById("start") as HTMLButtonElement;
        const stop = document.getElementById("stop") as HTMLButtonElement;
        start.disabled = false;
        stop.disabled = true;
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.toString());
        } else {
            setError("未知のエラーが発生しました。");
        }
    }
    
}

// 配信状態の変更ハンドラー
function onActiveStateChange(active: boolean): void {
    const start = document.getElementById("start") as HTMLButtonElement;
    const stop = document.getElementById("stop") as HTMLButtonElement;
    const statusEl = document.getElementById("broadcast-status");

    // stream-configは使わないため、一旦コメントアウト
    // const streamConfigSelectEl = document.getElementById("stream-config");
    // const inputEl = document.getElementById("stream-key");
    // inputEl.disabled = active;
    start.disabled = active;
    stop.disabled = !active;
    // streamConfigSelectEl.disabled = active;

    if (statusEl) {
        statusEl.textContent = active ? "配信中" : "配信停止中";
    }
}

// ユーザーのクリック後に AudioContext を再開
document.addEventListener(
    'click',
    () => {
        if (typeof AudioContext !== 'undefined') {
            const audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }
    },
    { once: true }
);

// 初期化関数
async function init(): Promise<void> {
    try {
        const videoSelectEl = document.getElementById("video-devices") as HTMLSelectElement;
        const audioSelectEl = document.getElementById("audio-devices") as HTMLSelectElement;

        await initializeDeviceSelect();

        videoSelectEl.addEventListener("change", handleVideoDeviceSelect, true);
        audioSelectEl.addEventListener("change", handleAudioDeviceSelect, true);

        config.streamConfig = channelConfigs[0][1]; // "Basic: Landscape"

        await createClient();
        await initializeDeviceSelect();

        handleValidationErrors(validate(), true);
    } catch (err: any) {
        setError(err.message);
    }
}

// ページロード時に初期化
window.addEventListener("load", init);
