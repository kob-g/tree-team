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
var API_BASE_URL = "https://pa8ltq3lw3.execute-api.us-west-2.amazonaws.com";
var roomID_params = "";
var chatToken = "";
var params = new URLSearchParams(window.location.search);
var socket = "wss://edge.ivschat.us-west-2.amazonaws.com";
var connection = null;
if (params.get("roomID")) {
    roomID_params = params.get("roomID");
    connectChatRoom(roomID_params);
}
function connectChatRoom(roomID) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    roomID_params = roomID;
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/connectChatRoom?roomID=").concat(encodeURIComponent(roomID)), {
                            method: "GET"
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    chatToken = data.token;
                    connection = new WebSocket(socket, chatToken);
                    connection.onopen = function (event) {
                        console.log("WebSocket is Ready!!!");
                    };
                    connection.onmessage = function (event) {
                        var _a;
                        var received = event.data;
                        var parsed = JSON.parse(received);
                        var message = ((_a = parsed.Attributes) === null || _a === void 0 ? void 0 : _a.message) || "No Message";
                        console.log(message);
                        var chatMessages = document.getElementById("chat-messages");
                        if (chatMessages) {
                            var newMessage = document.createElement("div");
                            newMessage.textContent = message;
                            chatMessages.appendChild(newMessage);
                        }
                    };
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log("Error:".concat(error_1));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function sendChat() {
    return __awaiter(this, void 0, void 0, function () {
        var chatInput, message, response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    chatInput = document.getElementById("chat-input");
                    message = chatInput && chatInput.value ? chatInput.value : "Hello World by Socket!";
                    return [4 /*yield*/, fetch("".concat(API_BASE_URL, "/sendChat"), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                roomID: roomID_params,
                                message: message
                            })
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log(data);
                    if (chatInput) {
                        chatInput.value = "";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log("Error:".concat(error_2));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// HTMLから呼び出せるようにwindowオブジェクトに紐づける
window.sendChat = sendChat;
