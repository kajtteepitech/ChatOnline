const socket = io('http://localhost:4242');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');

const messageHistory = JSON.parse(localStorage.getItem('messageHistory') || '[]');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('chat message', message);
    messageInput.value = '';
});

socket.on('chat message', (msg) => {
    const li = document.createElement('li');
    li.innerText = msg;
    messageList.appendChild(li);
    messageHistory.push(msg);
    localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
});

socket.on('message history', (history) => {
    history.forEach((msg) => {
        const li = document.createElement('li');
        li.innerText = msg;
        messageList.appendChild(li);
    });

    localStorage.setItem('messageHistory', JSON.stringify(history));
});
