import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function ChatSidebar({
	chats,
	selectedChatId,
	searchTerm,
	onSearchChange,
	onSelectChat,
}) {
	return (
		<aside className="flex h-full w-full shrink-0 flex-col border-r border-gray-200 bg-gray-50/50 md:w-80 lg:w-96">
			<div className="border-b border-gray-200 p-4">
				<h2 className="text-lg font-semibold text-gray-800">Chats</h2>
				<p className="mb-4 text-sm text-gray-500">Conversaciones recientes</p>
				<div className="relative">
					<FontAwesomeIcon
						className="absolute left-3 top-3 text-gray-400"
						icon={faSearch}
					/>
					<input
						className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#00543D]"
						onChange={(event) => onSearchChange(event.target.value)}
						placeholder="Buscar chats..."
						type="text"
						value={searchTerm}
					/>
				</div>
			</div>

			<ul className="flex-1 overflow-y-auto">
				{chats.length === 0 ? (
					<li className="px-5 py-8 text-center text-sm text-gray-500">
						No se encontraron conversaciones.
					</li>
				) : (
					chats.map((chat) => (
						<li key={chat.id}>
							<button
								className={`flex w-full cursor-pointer items-start gap-3 border-b border-l-4 border-b-gray-100 p-4 text-left transition-colors ${
									selectedChatId === chat.id
										? "border-l-[#00543D] bg-[#00543D]/5"
										: "border-l-transparent hover:bg-white"
								}`}
								onClick={() => onSelectChat(chat.id)}
								type="button"
							>
								<img
									alt={chat.name}
									className="h-12 w-12 rounded-full object-cover"
									src={chat.avatar}
								/>
								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center justify-between gap-2">
										<p className="truncate font-semibold text-gray-800">
											{chat.name}
										</p>
										<span className="shrink-0 text-xs text-gray-400">
											{chat.time}
										</span>
									</div>
									<p className="truncate text-xs font-medium text-[#00543D]">
										{chat.item}
									</p>
									<p
										className={`truncate text-sm ${
											chat.unread > 0
												? "font-semibold text-gray-800"
												: "text-gray-500"
										}`}
									>
										{chat.lastMessage}
									</p>
								</div>
								{chat.unread > 0 && (
									<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00543D] text-xs font-bold text-white">
										{chat.unread}
									</span>
								)}
							</button>
						</li>
					))
				)}
			</ul>
		</aside>
	);
}

export default memo(ChatSidebar);
