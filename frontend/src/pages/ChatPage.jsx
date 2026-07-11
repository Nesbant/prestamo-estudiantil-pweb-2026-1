import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatAcciones from "../components/chat/ChatAcciones";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import ChatListaMensajes from "../components/chat/ChatListaMensajes";
import ChatSidebar from "../components/chat/ChatSidebar";
import { useAuth } from "../features/auth/AuthContext";
import {
	createConversation,
	getConversationMessages,
	getConversations,
	sendConversationMessage,
} from "../features/chat/chatService";

const EMPTY_MESSAGES = [];

const getAvatarFallback = (name = "Usuario") =>
	`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00543D&color=fff`;

const formatTime = (value) => {
	if (!value) return "Ahora";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Ahora";

	return date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const normalizeConversation = (conversation) => {
	const otherUser = conversation.otherUser || {};
	const name = otherUser.name || "Usuario";

	return {
		id: String(conversation.id),
		postId: conversation.postId,
		name,
		item: conversation.postTitle || "Publicación sin título",
		avatar: otherUser.avatar || getAvatarFallback(name),
		lastMessage: conversation.lastMessage || "Escribe el primer mensaje...",
		time: formatTime(conversation.lastMessageAt || conversation.updatedAt),
		unread: Number(conversation.unread) || 0,
		isMyPost: Boolean(conversation.isMyPost),
		lastMessageAt: conversation.lastMessageAt,
		updatedAt: conversation.updatedAt,
	};
};

const normalizeMessage = (message, currentUserId) => ({
	id: String(message.id),
	sender: String(message.senderId) === String(currentUserId) ? "me" : "other",
	text: message.text || "",
	time: formatTime(message.createdAt),
	createdAt: message.createdAt,
});

const upsertConversation = (conversations, conversation) => [
	conversation,
	...conversations.filter((item) => item.id !== conversation.id),
];

export default function ChatPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const currentUserId = currentUser?.id;
	const messagesEndRef = useRef(null);
	const startConversation = location.state?.startConversation;

	const [activeChatId, setActiveChatId] = useState(null);
	const [contacts, setContacts] = useState([]);
	const [messages, setMessages] = useState({});
	const [newMessage, setNewMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [showConversationMobile, setShowConversationMobile] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [sendingMessage, setSendingMessage] = useState(false);
	const [error, setError] = useState("");
	const [messageError, setMessageError] = useState("");

	useEffect(() => {
		if (!currentUserId) return undefined;

		let ignore = false;

		async function loadConversations() {
			setLoadingConversations(true);
			setError("");

			try {
				const conversations = (await getConversations()).map(normalizeConversation);
				let nextContacts = conversations;
				let nextActiveChatId = conversations[0]?.id ?? null;

				if (startConversation?.postId && startConversation?.otherUserId) {
					try {
						const conversation = normalizeConversation(
							await createConversation(startConversation),
						);
						nextContacts = upsertConversation(conversations, conversation);
						nextActiveChatId = conversation.id;
					} catch (conversationError) {
						if (!ignore) setError(conversationError.message);
					} finally {
						if (!ignore) navigate(location.pathname, { replace: true, state: {} });
					}
				}

				if (ignore) return;
				setContacts(nextContacts);
				setActiveChatId(nextActiveChatId);
				setShowConversationMobile(Boolean(nextActiveChatId && startConversation));
			} catch (requestError) {
				if (!ignore) setError(requestError.message);
			} finally {
				if (!ignore) setLoadingConversations(false);
			}
		}

		loadConversations();

		return () => {
			ignore = true;
		};
	}, [currentUserId, location.pathname, navigate, startConversation]);

	const filteredContacts = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		if (!normalizedSearch) return contacts;

		return contacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(normalizedSearch) ||
				contact.item.toLowerCase().includes(normalizedSearch),
		);
	}, [contacts, searchTerm]);

	const activeChat = useMemo(
		() => contacts.find((contact) => contact.id === activeChatId),
		[activeChatId, contacts],
	);

	const currentMessages = useMemo(
		() => messages[activeChatId] ?? EMPTY_MESSAGES,
		[activeChatId, messages],
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [currentMessages]);

	useEffect(() => {
		if (!activeChatId || !currentUserId) return undefined;

		let ignore = false;

		async function loadMessages() {
			setLoadingMessages(true);
			setMessageError("");

			try {
				const conversationMessages = await getConversationMessages(activeChatId);
				if (ignore) return;
				setMessages((previousMessages) => ({
					...previousMessages,
					[activeChatId]: conversationMessages.map((message) =>
						normalizeMessage(message, currentUserId),
					),
				}));
			} catch (requestError) {
				if (!ignore) setMessageError(requestError.message);
			} finally {
				if (!ignore) setLoadingMessages(false);
			}
		}

		loadMessages();

		return () => {
			ignore = true;
		};
	}, [activeChatId, currentUserId]);

	const clearUnread = useCallback((chatId) => {
		setContacts((previousContacts) =>
			previousContacts.map((contact) =>
				contact.id === chatId ? { ...contact, unread: 0 } : contact,
			),
		);
	}, []);

	const handleSelectChat = useCallback(
		(chatId) => {
			setActiveChatId(chatId);
			setShowConversationMobile(true);
			clearUnread(chatId);
		},
		[clearUnread],
	);

	const handleBackToList = useCallback(() => {
		setShowConversationMobile(false);
	}, []);

	const sendChatMessage = useCallback(
		async (text) => {
			const trimmedText = text.trim();
			if (!trimmedText || !activeChatId || !currentUserId || sendingMessage) return;

			setSendingMessage(true);
			setMessageError("");

			try {
				const savedMessage = await sendConversationMessage(
					activeChatId,
					trimmedText,
				);
				const normalizedMessage = normalizeMessage(savedMessage, currentUserId);

				setMessages((previousMessages) => ({
					...previousMessages,
					[activeChatId]: [
						...(previousMessages[activeChatId] ?? EMPTY_MESSAGES),
						normalizedMessage,
					],
				}));
				setContacts((previousContacts) =>
					previousContacts.map((contact) =>
						contact.id === activeChatId
							? {
									...contact,
									lastMessage: normalizedMessage.text,
									time: normalizedMessage.time,
									lastMessageAt: savedMessage.createdAt,
									unread: 0,
								}
							: contact,
					),
				);
				setNewMessage("");
			} catch (requestError) {
				setMessageError(requestError.message);
			} finally {
				setSendingMessage(false);
			}
		},
		[activeChatId, currentUserId, sendingMessage],
	);

	const handleSendMessage = useCallback(
		(event) => {
			event.preventDefault();
			sendChatMessage(newMessage);
		},
		[newMessage, sendChatMessage],
	);

	const handleSharePhone = useCallback(() => {
		const phone = currentUser?.phone?.trim();
		sendChatMessage(
			phone
				? `Mi teléfono es ${phone}.`
				: "Aún no tengo un teléfono registrado en mi perfil.",
		);
	}, [currentUser?.phone, sendChatMessage]);

	const handleConfirmDelivery = useCallback(() => {
		if (!activeChat) return;
		sendChatMessage(`Confirmo que entregué "${activeChat.item}".`);
	}, [activeChat, sendChatMessage]);

	const handleConfirmReceived = useCallback(() => {
		if (!activeChat) return;
		sendChatMessage(`Confirmo que recibí "${activeChat.item}".`);
	}, [activeChat, sendChatMessage]);

	const handleRejectLoan = useCallback(() => {
		if (!activeChat) return;
		sendChatMessage(
			`No podré continuar con el préstamo de "${activeChat.item}".`,
		);
	}, [activeChat, sendChatMessage]);

	return (
		<main className="mx-auto flex h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-4 py-6 md:px-8">
			<div className="flex h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div
					className={`${showConversationMobile ? "hidden" : "block"} h-full w-full md:block md:w-auto`}
				>
					<ChatSidebar
						chats={filteredContacts}
						onSearchChange={setSearchTerm}
						onSelectChat={handleSelectChat}
						searchTerm={searchTerm}
						selectedChatId={activeChatId}
					/>
				</div>

				<section
					className={`${showConversationMobile ? "flex" : "hidden"} flex-1 flex-col bg-[#F9FAFB] md:flex`}
				>
					{error && (
						<div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
							{error}
						</div>
					)}

					{loadingConversations ? (
						<div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
							Cargando conversaciones...
						</div>
					) : activeChat ? (
						<>
							<ChatHeader chat={activeChat} onBack={handleBackToList} />
							{messageError && (
								<div className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
									{messageError}
								</div>
							)}
							{loadingMessages ? (
								<div className="flex flex-1 items-center justify-center p-6 text-sm text-gray-500">
									Cargando mensajes...
								</div>
							) : (
								<ChatListaMensajes
									messages={currentMessages}
									messagesEndRef={messagesEndRef}
								/>
							)}
							<ChatAcciones
								isMyPost={activeChat.isMyPost}
								onConfirmDelivery={handleConfirmDelivery}
								onConfirmReceived={handleConfirmReceived}
								onRejectLoan={handleRejectLoan}
								onSharePhone={handleSharePhone}
							/>
							<ChatInput
								disabled={sendingMessage || loadingMessages}
								onChange={setNewMessage}
								onSubmit={handleSendMessage}
								value={newMessage}
							/>
						</>
					) : (
						<div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
							No tienes conversaciones todavía.
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
