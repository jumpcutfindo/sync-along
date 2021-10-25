import React from "react";

import { useAppSelector, useAppDispatch } from "src/hooks/typedReduxHooks";
import useInputState from "src/hooks/useInputState";

import { sendMessage as sendMessageAction } from "src/stores/chat";

import "./index.css";

const MessageInput: React.FC = () => {
    const [messageInput, updateMessageInput, clearInput] = useInputState("");
    const dispatch = useAppDispatch();
    // const socket = {};
    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(sendMessageAction(messageInput));
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
    const data = useAppSelector((state) => state.chat.messages);
    return (
        <div>
            {data.map(({ id, text, username }) => (
                <Message key={id} user={username} message={text} />
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
