const API_BASE_URL = "https://pa8ltq3lw3.execute-api.us-west-2.amazonaws.com";
let roomID_params = "";
let chatToken = "";
const params = new URLSearchParams(window.location.search);
const socket = "wss://edge.ivschat.us-west-2.amazonaws.com";
let connection: WebSocket | null = null;

if (params.get("roomID")) {
    roomID_params = params.get("roomID") as string;
    connectChatRoom(roomID_params);
}

async function connectChatRoom(roomID: string): Promise<void> {
    try {
        roomID_params = roomID;

        const response = await fetch(`${API_BASE_URL}/connectChatRoom?roomID=${encodeURIComponent(roomID)}`, {
            method: "GET"
        });

        const data = await response.json() as { token: string };
        chatToken = data.token;
        connection = new WebSocket(socket, chatToken);

        connection.onopen = (event: Event) => {
            console.log("WebSocket is Ready!!!");
        };

        connection.onmessage = (event: MessageEvent) => {
            const received = event.data as string;
            const parsed = JSON.parse(received);
            const message = parsed.Attributes?.message || "No Message";

            console.log(message);

            displayBulletChat(message); // 弾幕チャットを表示

            const chatMessages = document.getElementById("chat-messages");
            if (chatMessages) {
                const newMessage = document.createElement("div");
                newMessage.textContent = message;
                chatMessages.appendChild(newMessage);
            }
        };
    } catch (error: any) {
        console.log(`Error:${error}`);
    }
}

async function sendChat(): Promise<void> {
    try {
        const chatInput = document.getElementById("chat-input") as HTMLInputElement;
        const message = chatInput && chatInput.value ? chatInput.value : "Hello World by Socket!";

        const response = await fetch(`${API_BASE_URL}/sendChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomID: roomID_params,
                message: message
            })
        });

        const data = await response.json();
        console.log(data);

        if (chatInput) {
            chatInput.value = "";
        }
    } catch (error: any) {
        console.log(`Error:${error}`);
    }
}

// 弾幕チャットを表示する関数
function displayBulletChat(message: string): void {
    const bulletChatContainer = document.getElementById("bullet-chat");
    if (!bulletChatContainer) return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("bullet-message");
    messageDiv.textContent = message;

    // ランダムな垂直位置を設定（画面上のどこかに表示）
    const maxHeight = bulletChatContainer.clientHeight - 30; // メッセージの高さを考慮
    const randomTop = Math.floor(Math.random() * maxHeight);
    messageDiv.style.top = `${randomTop}px`;

    bulletChatContainer.appendChild(messageDiv);

    // アニメーションが完了したらメッセージを削除
    messageDiv.addEventListener('animationend', () => {
        bulletChatContainer.removeChild(messageDiv);
    });
}

// HTMLから呼び出せるようにwindowオブジェクトに紐づける
(window as any).sendChat = sendChat;
