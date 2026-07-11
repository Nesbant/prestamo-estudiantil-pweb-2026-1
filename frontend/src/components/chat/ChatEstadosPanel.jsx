import { memo } from "react";

function ChatEstadosPanel({
	isMyPost,
	onConfirmDelivery,
	onConfirmReceived,
	onRequestLoan,
}) {
	return (
		<div className="flex flex-wrap gap-2 border-t border-gray-200 bg-white px-4 py-3">
			{!isMyPost && (
				<button
					className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
					onClick={onRequestLoan}
					type="button"
				>
					Solicitar préstamo
				</button>
			)}

			{isMyPost ? (
				<button
					className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
					onClick={onConfirmDelivery}
					type="button"
				>
					Confirmar entrega
				</button>
			) : (
				<button
					className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
					onClick={onConfirmReceived}
					type="button"
				>
					Confirmar recepción
				</button>
			)}
		</div>
	);
}

export default memo(ChatEstadosPanel);
