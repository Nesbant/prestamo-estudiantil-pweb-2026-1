import ChatHeader from "../components/chat/ChatHeader";
import ChatListaMensajes from "../components/chat/ChatListaMensajes";
import ChatEstadosPanel from "../components/chat/ChatEstadosPanel";
import ChatInput from "../components/chat/ChatInput";
function ChatPage() {
    return (
        <main>

        <section>
            <ChatHeader />
            <ChatListaMensajes/>
            <ChatEstadosPanel />
            <ChatInput/>
        </section>
        </main>

    )
}
    export default ChatPage;