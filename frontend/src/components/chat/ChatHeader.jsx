import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function ChatHeader({ chat, onBack }) {
	return (
		<header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white p-4">
			<div className="flex min-w-0 items-center gap-3">
				<button
					aria-label="Volver a la lista de chats"
					className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 md:hidden"
					onClick={onBack}
					type="button"
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</button>
				<img
					alt={chat.name}
					className="h-10 w-10 shrink-0 rounded-full object-cover"
					src={chat.avatar}
				/>
				<div className="min-w-0">
					<h2 className="truncate font-semibold text-gray-800">{chat.name}</h2>
					<p className="truncate text-xs font-medium text-[#00543D]">
						Ref: {chat.item}
					</p>
				</div>
			</div>

			<button
				aria-label="Ver información del chat"
				className="rounded-lg p-2 text-gray-400 transition-colors hover:text-gray-600"
				type="button"
			>
				<FontAwesomeIcon className="text-xl" icon={faInfoCircle} />
			</button>
		</header>
	);
}

export default memo(ChatHeader);
