const socket = new WebSocket('ws://localhost:8080');

const input = document.getElementById('input');
const sendButton = document.getElementById('sendButton');
const messages = document.getElementById('messages');
const avatar = document.getElementById('avatar');
const world = document.getElementById('world');

// Send chat
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

sendButton.addEventListener('click', (e) => {
    sendMessage();
});

// Receive chat
socket.addEventListener('message', event => {
  const data = JSON.parse(event.data);
  if (data.type === 'chat') {
    addMessage('Stranger: ' + data.text);
  } else if (data.type === 'move') {
    moveAvatar(data.x, data.y);
  }
});

function addMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  messages.appendChild(li);
}

function sendMessage() {
    const msg = input.value;
    socket.send(JSON.stringify({ type: 'chat', text: msg }));
    addMessage('You: ' + msg);
    input.value = '';
}

// Read clicks
let targetX = null;
let targetY = null;
let isMoving = false;

world.addEventListener('click', (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  targetX = e.clientX - rect.left - avatar.offsetWidth / 2;
  targetY = e.clientY - rect.top - avatar.offsetHeight / 2;

  if (!isMoving) {
    isMoving = true;
    animateAvatar();
  }
});

// Move avatar
function animateAvatar() {
  const speed = 8; // pixels per frame

  let currentX = avatar.offsetLeft;
  let currentY = avatar.offsetTop;

  const dx = targetX - currentX;
  const dy = targetY - currentY;
  const dist = Math.hypot(dx, dy);

   if (dist < speed) {
    moveAvatar(targetX, targetY);
    isMoving = false;
    socket.send(JSON.stringify({ type: 'move', x: targetX, y: targetY }));
    return;
   }

  const angle = Math.atan2(dy, dx);
  const nextX = currentX + Math.cos(angle) * speed;
  const nextY = currentY + Math.sin(angle) * speed;

  moveAvatar(nextX, nextY);

  requestAnimationFrame(animateAvatar);
}

function moveAvatar(x, y) {
  avatar.style.left = x + 'px';
  avatar.style.top = y + 'px';
}