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
(function (IVSPlayerPackage) {
    var videoElement = document.getElementById("video-player");
    var statusElement = document.getElementById("player-status");
    var playButton = document.getElementById("play");
    var stopButton = document.getElementById("stop");
    var player;
    var checkStreamInterval;
    // 再生URLを定数として定義
    var PLAYBACK_URL = "https://a140495bb918.ap-northeast-1.playback.live-video.net/api/video/v1/ap-northeast-1.495599775160.channel.vtU6skTfHUxS.m3u8";
    // ユーザーのクリック後に AudioContext を再開
    document.addEventListener('click', function () {
        if (typeof AudioContext !== 'undefined') {
            var audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        }
    }, { once: true });
    // プレイヤーの初期化
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
            playButton.disabled = true;
            stopButton.disabled = false;
            clearInterval(checkStreamInterval); // ストリームチェック停止
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.ENDED, function () {
            statusElement.innerHTML = "配信終了";
            statusElement.className = "offline";
            playButton.disabled = false;
            stopButton.disabled = true;
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.READY, function () {
            statusElement.innerHTML = "準備完了";
            statusElement.className = "";
        });
        player.addEventListener(IVSPlayerPackage.PlayerEventType.ERROR, function (err) {
            statusElement.innerHTML = "\u30A8\u30E9\u30FC: ".concat(err.message);
            statusElement.className = "error";
            playButton.disabled = false;
            stopButton.disabled = true;
        });
        player.addEventListener(IVSPlayerPackage.PlayerState.BUFFERING, function () {
            statusElement.innerHTML = "バッファリング中...";
            statusElement.className = "";
        });
    }
    // ストリームの読み込み
    function loadStream() {
        var streamUrl = PLAYBACK_URL;
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
    function stopStream() {
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
    function checkStream() {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetch(PLAYBACK_URL, { method: 'HEAD' })];
                    case 1:
                        response = _a.sent();
                        if (response.ok) {
                            statusElement.textContent = "配信が開始されました。再生を開始します...";
                            loadStream();
                            clearInterval(checkStreamInterval);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log("ストリームがまだ開始されていません。");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
    // 初期化関数
    function init() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    playButton.addEventListener("click", loadStream);
                    stopButton.addEventListener("click", stopStream);
                    // 配信が開始されているか定期的にチェック（例: 10秒ごと）
                    checkStreamInterval = window.setInterval(checkStream, 10000);
                }
                catch (err) {
                    console.error(err);
                    statusElement.textContent = "エラーが発生しました。";
                }
                return [2 /*return*/];
            });
        });
    }
    // ページロード時に初期化
    window.addEventListener("load", init);
    // グローバルスコープに関数を公開
    window.loadStream = loadStream;
    window.stopStream = stopStream;
})(window.IVSPlayer);
