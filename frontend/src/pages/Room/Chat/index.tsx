/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "src/hooks/typedReduxHooks";
import useTextAreaState from "src/hooks/useTextAreaState";

import {
    sendMessage as sendMessageAction,
    receiveMessages,
    Messages,
    disconnectSocket,
} from "src/stores/chat";

import "./index.css";

const MessageInput: React.FC = () => {
    const ref = useRef<HTMLFormElement>(null);
    const [messageInput, updateMessageInput, clearInput] = useTextAreaState("");
    const dispatch = useAppDispatch();

    const sendMessage = () => {
        dispatch(sendMessageAction(messageInput));
        clearInput();
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        sendMessage();
    };

    const onKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            dispatch(sendMessageAction(messageInput));
            clearInput();
        }
    };

    return (
        <div className="d-flex m-2">
            <form ref={ref} onSubmit={onSubmit} className="d-flex flex-grow-1">
                <textarea
                    className="message-input form-control me-2"
                    value={messageInput}
                    onChange={updateMessageInput}
                    onKeyPress={onKeyPress}
                    placeholder="Send a message"
                />
                <div>
                    <button
                        type="submit"
                        className="btn btn-primary message-input-send"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
};

const Message: React.FC<{ user: string; message: string; isEven: boolean }> = ({
    user,
    message,
    isEven,
}) => {
    return (
        <div
            className={`message-container d-flex p-2 text-start ${
                isEven ? "even" : ""
            }`}
        >
            <div className="message">
                <p className="m-0">
                    <b>{user}: </b>
                    {message}
                </p>
            </div>
        </div>
    );
};

type MessageListProps = {
    messages: Messages[];
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    const ref = useRef<HTMLDivElement>(null);
    const end = useRef<HTMLDivElement>(null);

    const scrollBottom = () => end.current?.scrollIntoView();

    useEffect(() => scrollBottom());

    return (
        <div ref={ref} className="message-list flex-grow-1">
            {messages.map(({ id, text, username }, index) => (
                <Message
                    key={id}
                    user={username}
                    message={text}
                    isEven={index % 2 === 0}
                />
            ))}
            <div ref={end} />
        </div>
    );
};

const ChatComponent: React.FC = () => {
    const dispatch = useAppDispatch();
    const [_, setIsLoading] = useState(true);
    useEffect(() => {
        dispatch(receiveMessages())
            .catch(() => console.log("error"))
            .finally(() => setIsLoading(false));
        return () => {
            dispatch(disconnectSocket());
        };
    }, []);
    const messages = useAppSelector((state) => state.chat.messages);
    // TODO: error handling
    // TODO: use isLoading to show state?
    return (
        <div className="ChatComponent h-100 d-flex flex-column">
            <h6 className="m-2 text-start">CHAT</h6>
            <MessageList messages={messages} />
            <MessageInput />
        </div>
    );
};

export default ChatComponent;
