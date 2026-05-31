export const mockContactos = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    item: 'Calculadora Científica Casio fx-991',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: 'Sí, nos vemos en la cafetería.',
    time: '10:30 AM',
    unread: 0,
  },
  {
    id: 2,
    name: 'Lucía Fernández',
    item: 'Libro de Cálculo Diferencial',
    avatar: 'https://i.pravatar.cc/150?u=lucia',
    lastMessage: '¿Aún lo tienes disponible?',
    time: '09:15 AM',
    unread: 2,
  },
  {
    id: 3,
    name: 'Martín Suárez',
    item: 'Bata de Laboratorio Talla M',
    avatar: 'https://i.pravatar.cc/150?u=martin',
    lastMessage: 'Gracias por el préstamo!',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 4,
    name: 'Ana Gómez',
    item: 'Laptop HP (Para exposición)',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    lastMessage: 'Te lo devuelvo a las 5 PM.',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 5,
    name: 'Roberto Díaz',
    item: 'Regla T y Escuadras',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    lastMessage: 'Perfecto, te espero en el pabellón C.',
    time: 'Mar 12',
    unread: 0,
  },
];

export const mockMensajes = {
  1: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola, ¿qué tal? Quería saber si aún prestas la calculadora.',
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: '¡Hola! Sí, claro que sí. ¿Para cuándo la necesitas?',
      time: '10:15 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Para hoy a las 11. ¿Podemos vernos en la cafetería central?',
      time: '10:25 AM',
    },
    {
      id: 4,
      sender: 'me',
      text: 'Me parece bien. Llevo una polera negra.',
      time: '10:28 AM',
    },
    {
      id: 5,
      sender: 'other',
      text: 'Sí, nos vemos en la cafetería.',
      time: '10:30 AM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola! Vi tu publicación del libro de cálculo.',
      time: '09:10 AM',
    },
    {
      id: 2,
      sender: 'other',
      text: '¿Aún lo tienes disponible?',
      time: '09:15 AM',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'me',
      text: 'Hola Martín, aquí te devuelvo la bata, muchas gracias.',
      time: 'Ayer, 4:00 PM',
    },
    {
      id: 2,
      sender: 'other',
      text: 'De nada, espero te haya servido.',
      time: 'Ayer, 4:15 PM',
    },
    {
      id: 3,
      sender: 'me',
      text: 'Muchísimo. ¡Gracias por el préstamo!',
      time: 'Ayer, 4:30 PM',
    },
  ],
};
