const socket = io();

let username;
var chats = document.querySelector(".chats")
var users_List = document.querySelector(".users-List")
var users_Count = document.querySelector(".users-Count")
var user_msg = document.querySelector('#messageInp');
var send_msg = document.querySelector('#sendmsg');


do {
    username = prompt("enter your name")
} while (!username);


socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
    }
});


socket.emit("new-user-joined", username);

socket.on('user-connected', (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add('user-join')
    let content = `<p><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);

}
socket.on('user-disconnected', (user) => {
    userJoinLeft(user, 'left')
});

send_msg.addEventListener('click', () => {
    let data = {
        user: username,
        msg: user_msg.value
    }
    if (user_msg.value != '') {
        appendMassage(data, 'outgoing')
        socket.emit('message', data);
        user_msg.value = '';
    }
})

socket.on('message', (data) => {
    appendMassage(data, 'incomming')
})

function appendMassage(data, status) {
    let div = document.createElement('div');
    let addcal = ('outgoing' == status) ? 'right' : 'left'
    let content = `
                <div class="my-dic ${addcal}">
                    <div class="message" > ${data.user} : ${data.msg}</div>
                </div>
             `
    div.innerHTML = content;
    chats.appendChild(div)
    chats.scrollTop = chats.scrollHeight;
}

