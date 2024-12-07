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
(function () {
    return __awaiter(this, void 0, void 0, function () {
        function fetchActiveChannels() {
            return __awaiter(this, void 0, void 0, function () {
                var response, channels, channelList, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, fetch('https://xyrmdiuws0.execute-api.us-west-2.amazonaws.com/tree-pro/listChannels')];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            channels = _a.sent();
                            channelList = Array.isArray(channels) ? channels : [channels];
                            channelListEl.innerHTML = '';
                            channelList.forEach(function (channel) {
                                var listItem = document.createElement('li');
                                var nameSpan = document.createElement('span');
                                nameSpan.textContent = channel.channelName || "Unknown Channel";
                                var viewButton = document.createElement('button');
                                viewButton.textContent = "表示";
                                viewButton.onclick = function () {
                                    location.href = "view.html?playbackUrl=".concat(encodeURIComponent(channel.playbackUrl), "&channelName=").concat(encodeURIComponent(channel.channelName), "&roomID=").concat(encodeURIComponent(channel.chatRoomID));
                                };
                                listItem.appendChild(nameSpan);
                                listItem.appendChild(viewButton);
                                channelListEl.appendChild(listItem);
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('配信者一覧の取得中にエラーが発生しました:', error_1);
                            statusElement.textContent = "\u914D\u4FE1\u8005\u4E00\u89A7\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ".concat(error_1.message);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var channelListEl, backButton, statusElement;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    channelListEl = document.getElementById("channel-list");
                    backButton = document.getElementById("backButton");
                    statusElement = document.createElement("div");
                    document.body.appendChild(statusElement);
                    backButton.onclick = function () {
                        // 戻るボタン
                        location.href = "index.html";
                    };
                    return [4 /*yield*/, fetchActiveChannels()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
})();
