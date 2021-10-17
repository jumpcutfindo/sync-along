import React from "react";
import useInputState from "src/hooks/useInputState";

import "./index.css";

const MessageInput: React.FC = () => {
    const [messageInput, updateMessageInput] = useInputState("");

    const sendMessage = (event: React.FormEvent) => {
        event.preventDefault();
    };
    return (
        <form onSubmit={sendMessage}>
            <input
                className="form-control"
                value={messageInput}
                onChange={updateMessageInput}
                placeholder="Send a message here!"
            />
        </form>
    );
};

const MessageList: React.FC = () => {
    return <div />;
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
