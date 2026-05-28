function ChatListaMensajes({ messages }) {
    return (
        <div className="chat-messages">
            {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                    {msg.text}
                </div>
            ))}
        </div>
    );
}

export default ChatListaMensajes;