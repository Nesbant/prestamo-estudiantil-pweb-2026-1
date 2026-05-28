function ChatSideBar({ chats }) {
    return (
        <aside className="chat-sidebar">
            <h2>Lista de chats</h2>

            <ul>
                {chats.map((chat) => (
                    <li key={chat.id}>{chat.name} - {chat.publicacion}</li>
                ))} 
            </ul>
        </aside>
    );
}

export default ChatSideBar;