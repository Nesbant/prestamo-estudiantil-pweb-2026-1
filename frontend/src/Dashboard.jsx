import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faBell,
  faUser,
  faClock,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';

const categorias = [
  { id: 1, nombre: 'Calculadora', emoji: '🖩' },
  { id: 2, nombre: 'Libro', emoji: '📚' },
  { id: 3, nombre: 'Cargador', emoji: '🔌' },
  { id: 4, nombre: 'Apuntes', emoji: '📝' },
  { id: 5, nombre: 'Laptop', emoji: '💻' },
  { id: 6, nombre: 'Tablet', emoji: '📱' },
  { id: 7, nombre: 'Audífonos', emoji: '🎧' },
  { id: 8, nombre: 'Otros', emoji: '📦' },
];

const publicaciones = [
  {
    id: 1,
    nombre: 'Carlos M.',
    tiempo: 'Hace 2 horas',
    tipo: 'SE PRESTA',
    titulo: 'Calculadora Teyas TI-84 🖩',
    descripcion: 'Presto calculadora gráfica en perfecto estado. Ideal para el examen de cálculo...',
    meta: { icono: 'reloj', texto: 'Disponible por 2 días' },
    boton: 'Contactar',
    avatar: null,
    iniciales: 'CM',
  },
  {
    id: 2,
    nombre: 'Ana P.',
    tiempo: 'Hace 5 horas',
    tipo: 'SE NECESITA',
    titulo: 'Cargador Mac Type-C ✈️',
    descripcion: 'Olvidé mi cargador en casa y tengo entrega de proyecto a las 5PM. ¿Alguien tiene uno?',
    meta: { icono: 'ubicacion', texto: 'Cafetería Ing.' },
    boton: 'Ofrecer',
    avatar: null,
    iniciales: 'AP',
    destacado: true,
  },
  {
    id: 3,
    nombre: 'Juan R.',
    tiempo: 'Ayer',
    tipo: 'SE PRESTA',
    titulo: 'Libro de Termodinámica 📚',
    descripcion: 'Cengel 9na edición. Lo presto por todo el semestre si alguien lo necesita....',
    meta: { icono: 'reloj', texto: 'Largo plazo' },
    boton: 'Contactar',
    avatar: null,
    iniciales: 'JR',
  },
];

function Navbar() {
  const [tabActiva, setTabActiva] = useState('explorar');

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <span className="text-2xl font-bold text-green-800">CampusLend</span>

      <nav className="flex gap-8">
        <button
          onClick={() => setTabActiva('explorar')}
          className={`pb-1 font-medium text-sm ${
            tabActiva === 'explorar'
              ? 'text-green-700 border-b-2 border-green-700'
              : 'text-gray-500'
          }`}
        >
          Explorar
        </button>
        <button
          onClick={() => setTabActiva('actividad')}
          className={`pb-1 font-medium text-sm ${
            tabActiva === 'actividad'
              ? 'text-green-700 border-b-2 border-green-700'
              : 'text-gray-500'
          }`}
        >
          Mi Actividad
        </button>
      </nav>

      <div className="flex items-center gap-4 text-gray-500">
        <FontAwesomeIcon icon={faBell} className="text-lg" />
        <FontAwesomeIcon icon={faUser} className="text-lg" />
      </div>
    </header>
  );
}

function BarraBusqueda() {
  return (
    <div className="flex justify-center px-8 py-6">
      <div className="flex items-center w-full max-w-2xl border border-gray-300 rounded-full px-4 py-2 bg-white shadow-sm">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Buscar libros, calculadoras, etc..."
          className="w-full outline-none text-gray-600 text-sm"
        />
      </div>
    </div>
  );
}

function FiltrosCategorias({ categoriaActiva, setCategoriaActiva }) {
  return (
    <div className="flex gap-2 px-8 flex-wrap">
      {categorias.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategoriaActiva(cat.id)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
            categoriaActiva === cat.id
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          {cat.nombre} {cat.emoji}
        </button>
      ))}
    </div>
  );
}

function TabsPublicaciones({ tabActiva, setTabActiva }) {
  return (
    <div className="flex gap-6 px-8 mt-6 border-b border-gray-200">
      <button
        onClick={() => setTabActiva('presta')}
        className={`pb-2 text-sm font-medium ${
          tabActiva === 'presta'
            ? 'text-gray-800 border-b-2 border-green-700'
            : 'text-gray-400'
        }`}
      >
        Se presta
      </button>
      <button
        onClick={() => setTabActiva('necesita')}
        className={`pb-2 text-sm font-medium ${
          tabActiva === 'necesita'
            ? 'text-gray-800 border-b-2 border-green-700'
            : 'text-gray-400'
        }`}
      >
        Se necesita
      </button>
    </div>
  );
}

function Avatar({ iniciales }) {
  return (
    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-bold text-gray-600">
      {iniciales}
    </div>
  );
}

function BadgeTipo({ tipo }) {
  const esPresta = tipo === 'SE PRESTA';
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded ${
        esPresta
          ? 'bg-green-100 text-green-700'
          : 'bg-blue-100 text-blue-700'
      }`}
    >
      {tipo}
    </span>
  );
}

function Tarjeta({ pub }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border ${
        pub.destacado ? 'border-blue-500 border-2' : 'border-gray-200'
      }`}
    >
      {/* Encabezado: avatar + nombre + badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Avatar iniciales={pub.iniciales} />
          <div>
            <p className="text-sm font-semibold text-gray-800">{pub.nombre}</p>
            <p className="text-xs text-gray-400">{pub.tiempo}</p>
          </div>
        </div>
        <BadgeTipo tipo={pub.tipo} />
      </div>

      {/* Título y descripción */}
      <h3 className="text-base font-bold text-gray-800 mb-1">{pub.titulo}</h3>
      <p className="text-sm text-gray-500 mb-4">{pub.descripcion}</p>

      <hr className="border-gray-100 mb-3" />

      {/* Pie: meta + botón */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <FontAwesomeIcon
            icon={pub.meta.icono === 'reloj' ? faClock : faLocationDot}
          />
          {pub.meta.texto}
        </span>

        {pub.boton === 'Contactar' ? (
          <button className="bg-green-800 text-white text-sm px-4 py-1.5 rounded-lg font-medium">
            Contactar
          </button>
        ) : (
          <button className="border border-blue-600 text-blue-600 text-sm px-4 py-1.5 rounded-lg font-medium">
            Ofrecer
          </button>
        )}
      </div>
    </div>
  );
}

function ListaPublicaciones() {
  return (
    <div className="grid grid-cols-3 gap-5 px-8 mt-6">
      {publicaciones.map((pub) => (
        <Tarjeta key={pub.id} pub={pub} />
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [categoriaActiva, setCategoriaActiva] = useState(1);
  const [tabActiva, setTabActiva] = useState('presta');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <BarraBusqueda />
      <FiltrosCategorias
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
      />
      <TabsPublicaciones tabActiva={tabActiva} setTabActiva={setTabActiva} />
      <ListaPublicaciones />
    </div>
  );
}
