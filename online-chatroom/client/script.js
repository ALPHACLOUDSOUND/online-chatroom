const socket = io();

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const usersUl = document.getElementById('users');

let username = prompt('Enter your username:');
socket.emit('join', username);

socket.on('userList', (users) => {
    usersUl.innerHTML = '';
    users.forEach(user => {
        let li = document.createElement('li');
        li.textContent = user.username;
        usersUl.appendChild(li);
    });
});

socket.on('message', (msg) => {
    let div = document.createElement('div');
    div.textContent = `${msg.user}: ${msg.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

sendBtn.addEventListener('click', () => {
    let text = messageInput.value;
    socket.emit('message', { user: username, text });
    messageInput.value = '';
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
