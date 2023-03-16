const socket = io('http://localhost:4242');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageList = document.getElementById('message-list');

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
});
