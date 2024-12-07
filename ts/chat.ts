const API_BASE_URL = "https://pa8ltq3lw3.execute-api.us-west-2.amazonaws.com";
let roomID = "";
let chatToken = "";
const params = new URLSearchParams(window.location.search);
const socket = "wss://edge.ivschat.us-west-2.amazonaws.com";
let connection: WebSocket | null = null;

if (params.get("roomID")) {
    roomID = params.get("roomID") as string;
    connectChatRoom(roomID);
}

async function connectChatRoom(roomID: string): Promise<void> {
    try {
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
                roomID: roomID,
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

async function createChatRoom(): Promise<void> {
    const roomName = prompt("ルーム名を決めましょう");

    if (!roomName) {
        alert("ルーム名を再度入力して下さい");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/createChatRoom`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomName: roomName,
            }),
        });

        const data = await response.json() as { roomID: string };
        const createdRoomID = data.roomID;
        window.location.href = `http://localhost:8888/hackason/test?roomID=${encodeURIComponent(createdRoomID)}`;
        console.log(data);
    } catch (error: any) {
        console.log(`Error: ${error}`);
    }
}

// HTMLから呼び出せるようにwindowオブジェクトに紐づける
(window as any).sendChat = sendChat;
(window as any).createChatRoom = createChatRoom;
