import { memo } from "react";

function ChatMensaje({ message }) {
	const isMine = message.sender === "me";

	return (
		<div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
			<div
				className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
					isMine
						? "rounded-br-none bg-[#00543D] text-white"
						: "rounded-bl-none border border-gray-200 bg-white text-gray-800"
				}`}
			>
				<p className="text-sm leading-relaxed">{message.text}</p>
			</div>
			<span className="mt-1 text-xs text-gray-400">{message.time}</span>
		</div>
	);
}

export default memo(ChatMensaje);
