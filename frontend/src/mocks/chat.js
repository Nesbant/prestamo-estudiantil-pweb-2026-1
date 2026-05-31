export const contactosChatMock = [
  {
    id: 1,
    name: 'Carlos Mendoza',
    item: 'Calculadora Cientifica Casio fx-991',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    lastMessage: 'Si, nos vemos en la cafeteria.',
    time: '10:30 AM',
    unread: 0,
    isMyPost: true,
  },
  {
    id: 2,
    name: 'Lucia Fernandez',
    item: 'Libro de Calculo Diferencial',
    avatar: 'https://i.pravatar.cc/150?u=lucia',
    lastMessage: 'Aun lo tienes disponible?',
    time: '09:15 AM',
    unread: 2,
  },
  {
    id: 3,
    name: 'Martin Suarez',
    item: 'Bata de Laboratorio Talla M',
    avatar: 'https://i.pravatar.cc/150?u=martin',
    lastMessage: 'Gracias por el prestamo!',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 4,
    name: 'Ana Gomez',
    item: 'Laptop HP (Para exposicion)',
    avatar: 'https://i.pravatar.cc/150?u=ana',
    lastMessage: 'Te lo devuelvo a las 5 PM.',
    time: 'Ayer',
    unread: 0,
  },
  {
    id: 5,
    name: 'Roberto Diaz',
    item: 'Regla T y Escuadras',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    lastMessage: 'Perfecto, te espero en el pabellon C.',
    time: 'Mar 12',
    unread: 0,
  },
];

export const mensajesChatMock = {
  1: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola, que tal? Queria saber si aun prestas la calculadora.',
      time: '10:00 AM',
    },
    {
      id: 2,
      sender: 'me',
      text: 'Hola! Si, claro que si. Para cuando la necesitas?',
      time: '10:15 AM',
    },
    {
      id: 3,
      sender: 'other',
      text: 'Para hoy a las 11. Podemos vernos en la cafeteria central?',
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
      text: 'Si, nos vemos en la cafeteria.',
      time: '10:30 AM',
    },
  ],
  2: [
    {
      id: 1,
      sender: 'other',
      text: 'Hola! Vi tu publicacion del libro de calculo.',
      time: '09:10 AM',
    },
    {
      id: 2,
      sender: 'other',
      text: 'Aun lo tienes disponible?',
      time: '09:15 AM',
    },
  ],
  3: [
    {
      id: 1,
      sender: 'me',
      text: 'Hola Martin, aqui te devuelvo la bata, muchas gracias.',
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
      text: 'Muchisimo. Gracias por el prestamo!',
      time: 'Ayer, 4:30 PM',
    },
  ],
};
