"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// ストリームキーとエンドポイントの設定
var STREAM_KEY = "sk_ap-northeast-1_x22iY0SkaCPV_Ezbc5fDMdmyDtOxbZWNgnqHcTQfJKM";
var INGEST_ENDPOINT = "a140495bb918.global-contribute.live-video.net";
var channelConfigs = [
    ["Basic: Landscape", window.IVSBroadcastClient.BASIC_LANDSCAPE],
    ["Basic: Portrait", window.IVSBroadcastClient.BASIC_PORTRAIT],
    ["Standard: Landscape", window.IVSBroadcastClient.STANDARD_LANDSCAPE],
    ["Standard: Portrait", window.IVSBroadcastClient.STANDARD_PORTRAIT]
];
var config = {
    ingestEndpoint: INGEST_ENDPOINT,
    streamConfig: window.IVSBroadcastClient.BASIC_LANDSCAPE, // 低レイテンシー設定
    logLevel: window.IVSBroadcastClient.LOG_LEVEL.DEBUG
};
// エラーハンドリング
function clearError() {
    var errorEl = document.getElementById("error");
    if (errorEl) {
        errorEl.innerHTML = "";
    }
}
function setError(message) {
    if (Array.isArray(message)) {
        message = message.join("<br/>");
    }
    var errorEl = document.getElementById("error");
    if (errorEl) {
        errorEl.innerHTML = message;
    }
}
// デバイス取得
function getDevices() {
    return __awaiter(this, void 0, void 0, function () {
        var devices, videoDevices, audioDevices, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, navigator.mediaDevices.enumerateDevices()];
                case 1:
                    devices = _a.sent();
                    videoDevices = devices.filter(function (d) { return d.kind === "videoinput"; });
                    audioDevices = devices.filter(function (d) { return d.kind === "audioinput"; });
                    if (!videoDevices.length) {
                        setError("ビデオデバイスが見つかりません。");
                    }
                    if (!audioDevices.length) {
                        setError("オーディオデバイスが見つかりません。");
                    }
                    return [2 /*return*/, { videoDevices: videoDevices, audioDevices: audioDevices }];
                case 2:
                    error_1 = _a.sent();
                    setError("デバイスの取得に失敗しました。");
                    console.error(error_1);
                    return [2 /*return*/, { videoDevices: [], audioDevices: [] }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// デバイス選択の初期化
function initializeDeviceSelect() {
    return __awaiter(this, void 0, void 0, function () {
        var videoSelectEl, audioSelectEl, _a, videoDevices, audioDevices;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    videoSelectEl = document.getElementById("video-devices");
                    audioSelectEl = document.getElementById("audio-devices");
                    return [4 /*yield*/, getDevices()];
                case 1:
                    _a = _b.sent(), videoDevices = _a.videoDevices, audioDevices = _a.audioDevices;
                    videoDevices.forEach(function (device, index) {
                        videoSelectEl.options[index] = new Option(device.label || "\u30AB\u30E1\u30E9 ".concat(index + 1), device.deviceId);
                    });
                    audioSelectEl.options[0] = new Option("None", "None");
                    audioDevices.forEach(function (device, index) {
                        audioSelectEl.options[index + 1] = new Option(device.label || "\u30DE\u30A4\u30AF ".concat(index + 1), device.deviceId);
                    });
                    videoSelectEl.disabled = false;
                    audioSelectEl.disabled = false;
                    return [2 /*return*/];
            }
        });
    });
}
// クライアントの作成
function createClient() {
    return __awaiter(this, void 0, void 0, function () {
        var previewEl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (window.client) {
                        window.client.delete();
                    }
                    window.client = window.IVSBroadcastClient.create(config);
                    window.client.on(window.IVSBroadcastClient.BroadcastClientEvents.ACTIVE_STATE_CHANGE, function (active) {
                        onActiveStateChange(active);
                    });
                    previewEl = document.getElementById("preview");
                    window.client.attachPreview(previewEl);
                    return [4 /*yield*/, handleVideoDeviceSelect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handleAudioDeviceSelect()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// ビデオデバイスの処理
function handleVideoDeviceSelect() {
    return __awaiter(this, void 0, void 0, function () {
        var id, videoSelectEl, videoDevices, selectedDevice, deviceId, _a, width, height, cameraStream;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = "camera";
                    videoSelectEl = document.getElementById("video-devices");
                    return [4 /*yield*/, getDevices()];
                case 1:
                    videoDevices = (_b.sent()).videoDevices;
                    if (window.client.getVideoInputDevice(id)) {
                        window.client.removeVideoInputDevice(id);
                    }
                    selectedDevice = videoDevices.find(function (device) { return device.deviceId === videoSelectEl.value; });
                    deviceId = selectedDevice ? selectedDevice.deviceId : null;
                    _a = config.streamConfig.maxResolution, width = _a.width, height = _a.height;
                    return [4 /*yield*/, getCamera(deviceId, width, height)];
                case 2:
                    cameraStream = _b.sent();
                    return [4 /*yield*/, window.client.addVideoInputDevice(cameraStream, id, { index: 0 })];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// マイクデバイスの処理
function handleAudioDeviceSelect() {
    return __awaiter(this, void 0, void 0, function () {
        var id, audioSelectEl, audioDevices, selectedDevice, microphoneStream, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = "microphone";
                    audioSelectEl = document.getElementById("audio-devices");
                    return [4 /*yield*/, getDevices()];
                case 1:
                    audioDevices = (_a.sent()).audioDevices;
                    if (window.client.getAudioInputDevice(id)) {
                        window.client.removeAudioInputDevice(id);
                    }
                    if (audioSelectEl.value.toLowerCase() === "none")
                        return [2 /*return*/];
                    selectedDevice = audioDevices.find(function (device) { return device.deviceId === audioSelectEl.value; });
                    if (!selectedDevice) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            audio: { deviceId: selectedDevice.deviceId }
                        })];
                case 3:
                    microphoneStream = _a.sent();
                    return [4 /*yield*/, window.client.addAudioInputDevice(microphoneStream, id)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    setError("マイクの取得に失敗しました。");
                    console.error(error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// カメラストリームの取得
function getCamera(deviceId, maxWidth, maxHeight) {
    return __awaiter(this, void 0, void 0, function () {
        var media, videoConstraints, e_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videoConstraints = {
                        deviceId: deviceId ? { exact: deviceId } : undefined,
                        width: { max: maxWidth },
                        height: { max: maxHeight }
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 8]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: videoConstraints,
                            audio: true
                        })];
                case 2:
                    media = _a.sent();
                    return [3 /*break*/, 8];
                case 3:
                    e_1 = _a.sent();
                    // 幅と高さの制約を削除して再試行
                    delete videoConstraints.width;
                    delete videoConstraints.height;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: videoConstraints
                        })];
                case 5:
                    media = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    setError("カメラストリームの取得に失敗しました。");
                    console.error(error_3);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 8];
                case 8: return [2 /*return*/, media];
            }
        });
    });
}
// フォームのバリデーション（必要なくなるため簡略）
function validate() {
    // 自動設定のため空
    return [];
}
function handleValidationErrors(errors, doNotDisplay) {
    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
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
function startBroadcast() {
    return __awaiter(this, void 0, void 0, function () {
        var start, stop, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    start = document.getElementById("start");
                    stop = document.getElementById("stop");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    start.disabled = true;
                    return [4 /*yield*/, window.client.startBroadcast(STREAM_KEY, config.ingestEndpoint)];
                case 2:
                    _a.sent();
                    stop.disabled = false;
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    if (err_1 instanceof Error) {
                        setError(err_1.toString());
                    }
                    else {
                        setError("未知のエラーが発生しました。");
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 配信停止
function stopBroadcast() {
    return __awaiter(this, void 0, void 0, function () {
        var start, stop_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, window.client.stopBroadcast()];
                case 1:
                    _a.sent();
                    start = document.getElementById("start");
                    stop_1 = document.getElementById("stop");
                    start.disabled = false;
                    stop_1.disabled = true;
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    if (err_2 instanceof Error) {
                        setError(err_2.toString());
                    }
                    else {
                        setError("未知のエラーが発生しました。");
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// 配信状態の変更ハンドラー
function onActiveStateChange(active) {
    var start = document.getElementById("start");
    var stop = document.getElementById("stop");
    var statusEl = document.getElementById("broadcast-status");
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
document.addEventListener('click', function () {
    if (typeof AudioContext !== 'undefined') {
        var audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }
}, { once: true });
// 初期化関数
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var videoSelectEl, audioSelectEl, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    videoSelectEl = document.getElementById("video-devices");
                    audioSelectEl = document.getElementById("audio-devices");
                    return [4 /*yield*/, initializeDeviceSelect()];
                case 1:
                    _a.sent();
                    videoSelectEl.addEventListener("change", handleVideoDeviceSelect, true);
                    audioSelectEl.addEventListener("change", handleAudioDeviceSelect, true);
                    config.streamConfig = channelConfigs[0][1]; // "Basic: Landscape"
                    return [4 /*yield*/, createClient()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, initializeDeviceSelect()];
                case 3:
                    _a.sent();
                    handleValidationErrors(validate(), true);
                    return [3 /*break*/, 5];
                case 4:
                    err_3 = _a.sent();
                    setError(err_3.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// ページロード時に初期化
window.addEventListener("load", init);
