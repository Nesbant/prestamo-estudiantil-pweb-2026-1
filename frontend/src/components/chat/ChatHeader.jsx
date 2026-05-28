function ChatHeader({ chat }) {
    return (
        <header>
            <div>
                <h2>{chat.name}</h2>
                <p>{chat.publicacion}</p>
            </div>

            <button onClick={() => console.log('Compartir mi telefono')}>Compartir mi telefono</button>
        </header>
    );
}