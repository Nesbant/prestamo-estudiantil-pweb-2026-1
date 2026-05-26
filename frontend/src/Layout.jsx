import Stat from './Stat';
import {
  faListCheck,
  faClipboardList,
  faSquareCheck,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

export default function Layout() {
  return (
    <main className='mx-15'>
      <section className='mt-6 mb-8'>
        <h1 className='text-4xl font-semibold'>Mis Publicaciones</h1>
        <h2 className='mt-2 text-gray-600'>
          Gestiona los articulos que ofreces y los que estes buscando
        </h2>
      </section>
      <section className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <Stat
          title='Ofrecidos'
          total='12'
          description='Artículos disponibles'
          color='#00543D'
          icon={faListCheck}
        />
        <Stat
          title='Buscados'
          total='5'
          description='Artículos solicitados'
          color='#EAB308'
          icon={faClipboardList}
        />
        <Stat
          title='Prestados'
          total='3'
          description='En posesión de otros'
          color='#3B82F6'
          icon={faSquareCheck}
        />
        <Stat
          title='Favoritos'
          total='24'
          description='Guardados para después'
          color='#EF4444'
          icon={faStar}
        />
      </section>
    </main>
  );
}
