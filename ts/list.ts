interface ActiveChannel {
  channelName: string;
  playbackUrl: string;
}

(async function() {
  const channelListEl = document.getElementById("channel-list") as HTMLUListElement;
  const backButton = document.getElementById("backButton") as HTMLButtonElement;
  const statusElement = document.createElement("div");
  document.body.appendChild(statusElement);

  backButton.onclick = () => {
      // 戻るボタン
      location.href = "index.html";
  };

  async function fetchActiveChannels() {
    try {
        const response = await fetch('https://xyrmdiuws0.execute-api.us-west-2.amazonaws.com/tree-pro/listChannels');
        const channels = await response.json();

        // APIがオブジェクトを返した場合、配列に変換
        // 配列にしたつもりだけど、なんかオブジェクトで返ってくる。よくわからん
        const channelList = Array.isArray(channels) ? channels : [channels];

        channelListEl.innerHTML = '';

        channelList.forEach((channel: any) => {
            const listItem = document.createElement('li');
            const nameSpan = document.createElement('span');
            nameSpan.textContent = channel.channelName || "Unknown Channel";

            const viewButton = document.createElement('button');
            viewButton.textContent = "表示";
            viewButton.onclick = () => {
                location.href = `view.html?playbackUrl=${encodeURIComponent(channel.playbackUrl)}&channelName=${encodeURIComponent(channel.channelName)}`;
            };

            listItem.appendChild(nameSpan);
            listItem.appendChild(viewButton);
            channelListEl.appendChild(listItem);
        });
    } catch (error: any) {
        console.error('配信者一覧の取得中にエラーが発生しました:', error);
        statusElement.textContent = `配信者一覧の取得に失敗しました: ${error.message}`;
    }
}

  await fetchActiveChannels();
})();

