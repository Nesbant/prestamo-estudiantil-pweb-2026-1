function ChatInput({ message, setMessage, onSend }) {
    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };  
}
export default ChatInput;