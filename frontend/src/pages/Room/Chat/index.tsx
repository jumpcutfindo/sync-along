import React from "react";

import { useAppSelector } from "src/hooks/typedReduxHooks";
import useInputState from "src/hooks/useInputState";

import "./index.css";

const MessageInput: React.FC = () => {
    const [messageInput, updateMessageInput, clearInput] = useInputState("");
    // const socket = {};
    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        // socket.emit("chat", messageInput);
        clearInput();
    };
    return (
        <form onSubmit={sendMessage}>
            <input
                className="message-input form-control"
                value={messageInput}
                onChange={updateMessageInput}
                placeholder="Send a message here!"
            />
        </form>
    );
};

const Message: React.FC<{ user: string; message: string }> = ({
    user,
    message,
}) => {
    if (user === "User1") {
        return (
            <div className="message-container">
                <div className="text-container is-user">{message}</div>
            </div>
        );
    }
    return (
        <div className="message-container">
            <div className="d-flex">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
                    alt="user avatar"
                    width="32"
                    height="32"
                />
                <div className="message text-container">
                    <div className="username">{user}</div>
                    <div>{message}</div>
                </div>
            </div>
        </div>
    );
};

const MessageList: React.FC = () => {
    const roomNumber = useAppSelector((state) => state.room.roomCode);
    console.log(roomNumber);
    const data = [
        {
            id: "1",
            text: "Hello!",
            userName: "user1",
        },
    ];
    return (
        <div>
            {data.map(({ id, text, userName }) => (
                <Message key={id} user={userName} message={text} />
            ))}
        </div>
    );
};

const ChatComponent: React.FC = () => {
    return (
        <div className="ChatComponent h-100">
            <MessageList />
            <MessageInput />
        </div>
    );
};

export default ChatComponent;
