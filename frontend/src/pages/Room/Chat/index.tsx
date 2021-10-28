/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

import { useAppSelector, useAppDispatch } from "src/hooks/typedReduxHooks";
import useTextAreaState from "src/hooks/useTextAreaState";

import {
    sendMessage as sendMessageAction,
    receiveMessages,
    stopReceiveMessages,
} from "src/stores/chat";

import "./index.css";

const MessageInput: React.FC = () => {
    const [messageInput, updateMessageInput, clearInput] = useTextAreaState("");
    const dispatch = useAppDispatch();

    const sendMessage = (event: any) => {
        event.preventDefault();
        dispatch(sendMessageAction(messageInput));
        clearInput();
    };

    return (
        <div className="d-flex m-2">
            <form onSubmit={sendMessage} className="flex-grow-1">
                <textarea
                    className="message-input form-control"
                    value={messageInput}
                    onChange={updateMessageInput}
                    placeholder="Send a message"
                />
            </form>
        </div>
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
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(receiveMessages(dispatch));
        return () => {
            dispatch(stopReceiveMessages);
        };
    }, []);
    const data = useAppSelector((state) => state.chat.messages);
    return (
        <div className="message-list flex-grow-1">
            {data.map(({ id, text, username }) => (
                <Message key={id} user={username} message={text} />
            ))}
        </div>
    );
};

const ChatComponent: React.FC = () => {
    return (
        <div className="ChatComponent h-100 d-flex flex-column">
            <MessageList />
            <MessageInput />
        </div>
    );
};

export default ChatComponent;
