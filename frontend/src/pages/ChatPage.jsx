import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatAcciones from "../components/chat/ChatAcciones";
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import ChatListaMensajes from "../components/chat/ChatListaMensajes";
import ChatSidebar from "../components/chat/ChatSidebar";
import { useAuth } from "../features/auth/AuthContext";
import { chatContactsMock, chatMessagesMock } from "../mocks/chat";

const EMPTY_MESSAGES = [];
const FIRST_CHAT_ID = chatContactsMock[0]?.id ?? null;

const getCurrentTime = () =>
	new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

const createMessageId = () =>
	`${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getAvatarFallback = (name = "Usuario") =>
	`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00543D&color=fff`;

const normalizeIncomingContact = (incoming) => {
	if (!incoming) return null;

	return {
		id: incoming.id,
		name: incoming.name || "Usuario",
		item: incoming.item || incoming.publicacion || "Publicación sin título",
		avatar: incoming.avatar || getAvatarFallback(incoming.name),
		lastMessage: incoming.lastMessage || "Escribe el primer mensaje...",
		time: "Ahora",
		unread: 0,
		isMyPost: Boolean(incoming.isMyPost),
	};
};

export default function ChatPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const messagesEndRef = useRef(null);
	const routeContact = normalizeIncomingContact(location.state?.newContact);
	const routeContactExists = chatContactsMock.some(
		(contact) => contact.id === routeContact?.id,
	);

	const [activeChatId, setActiveChatId] = useState(
		routeContact?.id ?? FIRST_CHAT_ID,
	);
	const [contacts, setContacts] = useState(chatContactsMock);
	const [tempContact, setTempContact] = useState(() =>
		routeContact && !routeContactExists ? routeContact : null,
	);
	const [messages, setMessages] = useState(chatMessagesMock);
	const [newMessage, setNewMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [showConversationMobile, setShowConversationMobile] = useState(
		Boolean(routeContact),
	);

	useEffect(() => {
		if (location.state?.newContact) {
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location.pathname, location.state, navigate]);

	const displayContacts = useMemo(() => {
		if (!tempContact) return contacts;

		const uniqueContacts = new Map();
		[tempContact, ...contacts].forEach((contact) => {
			if (!uniqueContacts.has(contact.id))
				uniqueContacts.set(contact.id, contact);
		});

		return Array.from(uniqueContacts.values());
	}, [contacts, tempContact]);

	const filteredContacts = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();
		if (!normalizedSearch) return displayContacts;

		return displayContacts.filter(
			(contact) =>
				contact.name.toLowerCase().includes(normalizedSearch) ||
				contact.item.toLowerCase().includes(normalizedSearch),
		);
	}, [displayContacts, searchTerm]);

	const activeChat = useMemo(
		() => displayContacts.find((contact) => contact.id === activeChatId),
		[activeChatId, displayContacts],
	);

	const currentMessages = useMemo(
		() => messages[activeChatId] ?? EMPTY_MESSAGES,
		[activeChatId, messages],
	);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [currentMessages]);

	const clearUnread = useCallback((chatId) => {
		setContacts((previousContacts) =>
			previousContacts.map((contact) =>
				contact.id === chatId ? { ...contact, unread: 0 } : contact,
			),
		);
		setTempContact((previousContact) =>
			previousContact?.id === chatId
				? { ...previousContact, unread: 0 }
				: previousContact,
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

	const appendOutgoingMessage = useCallback(
		(text) => {
			const trimmedText = text.trim();
			if (!trimmedText || !activeChatId) return;

			const sentAt = getCurrentTime();
			const sentMessage = {
				id: createMessageId(),
				sender: "me",
				text: trimmedText,
				time: sentAt,
			};

			setMessages((previousMessages) => ({
				...previousMessages,
				[activeChatId]: [
					...(previousMessages[activeChatId] ?? EMPTY_MESSAGES),
					sentMessage,
				],
			}));

			setContacts((previousContacts) => {
				if (tempContact && activeChatId === tempContact.id) {
					return [
						{
							...tempContact,
							lastMessage: trimmedText,
							time: sentAt,
							unread: 0,
						},
						...previousContacts,
					];
				}

				return previousContacts.map((contact) =>
					contact.id === activeChatId
						? {
								...contact,
								lastMessage: trimmedText,
								time: sentAt,
								unread: 0,
							}
						: contact,
				);
			});

			if (tempContact && activeChatId === tempContact.id) {
				setTempContact(null);
			}
		},
		[activeChatId, tempContact],
	);

	const handleSendMessage = useCallback(
		(event) => {
			event.preventDefault();
			appendOutgoingMessage(newMessage);
			setNewMessage("");
		},
		[appendOutgoingMessage, newMessage],
	);

	const handleSharePhone = useCallback(() => {
		const phone = currentUser?.phone?.trim();
		appendOutgoingMessage(
			phone
				? `Mi teléfono es ${phone}.`
				: "Aún no tengo un teléfono registrado en mi perfil.",
		);
	}, [appendOutgoingMessage, currentUser?.phone]);

	const handleConfirmDelivery = useCallback(() => {
		if (!activeChat) return;
		appendOutgoingMessage(`Confirmo que entregué "${activeChat.item}".`);
	}, [activeChat, appendOutgoingMessage]);

	const handleConfirmReceived = useCallback(() => {
		if (!activeChat) return;
		appendOutgoingMessage(`Confirmo que recibí "${activeChat.item}".`);
	}, [activeChat, appendOutgoingMessage]);

	const handleRejectLoan = useCallback(() => {
		if (!activeChat) return;
		appendOutgoingMessage(
			`No podré continuar con el préstamo de "${activeChat.item}".`,
		);
	}, [activeChat, appendOutgoingMessage]);

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
					{activeChat ? (
						<>
							<ChatHeader chat={activeChat} onBack={handleBackToList} />
							<ChatListaMensajes
								messages={currentMessages}
								messagesEndRef={messagesEndRef}
							/>
							<ChatAcciones
								isMyPost={activeChat.isMyPost}
								onConfirmDelivery={handleConfirmDelivery}
								onConfirmReceived={handleConfirmReceived}
								onRejectLoan={handleRejectLoan}
								onSharePhone={handleSharePhone}
							/>
							<ChatInput
								onChange={setNewMessage}
								onSubmit={handleSendMessage}
								value={newMessage}
							/>
						</>
					) : (
						<div className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
							Selecciona una conversación para comenzar.
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
