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
    const [data] = useState([
        {
            user: "User1",
            message: "New message!",
        },
        {
            user: "User2",
            message: "Message from other user",
        },
    ]);
    return (
        <div>
            {data.map(({ message, user }) => (
                <Message key="message" user={user} message={message} />
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
