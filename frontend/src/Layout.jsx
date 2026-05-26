import Stat from "./Stat"

export default function Layout(){
    return(
        <main className="mx-15">
            <section>
                <h1 className="text-4xl font-semibold">Mis Publicaciones</h1>
                <h2>Gestiona los articulos que ofreces y los que estes buscando</h2>
            </section>
            <section>
                <Stat />
            </section>
        </main>
    )
}