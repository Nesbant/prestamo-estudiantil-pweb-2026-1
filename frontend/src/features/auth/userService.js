const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export const getUsers = async () => {
  const savedUsers = localStorage.getItem(USERS_KEY);
  return savedUsers ? JSON.parse(savedUsers) : [];
};

export const saveUsers = async (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (userData) => {
  const users = await getUsers();

  const cleanEmail = userData.email.trim().toLowerCase();

  const emailExists = users.some(
    (user) => user.email.toLowerCase() === cleanEmail,
  );

  if (emailExists) {
    return {
      ok: false,
      message: 'Este correo ya se encuentra registrado',
    };
  }

  const newUser = {
  id: Date.now(),
  name: userData.name.trim(),
  email: cleanEmail,
  institution: userData.institution,
  studentId: userData.studentId.trim(),
  phone: userData.phone.trim(),
  major: userData.major,
  campus: userData.campus,
  password: userData.password,
};

  const newList = [...users, newUser];
  await saveUsers(newList);

  return {
    ok: true,
    message: 'Usuario registrado correctamente',
  };
};

export const loginUser = async (email, password) => {
  const users = await getUsers();
  const cleanEmail = email.trim().toLowerCase();

  const foundUser = users.find(
    (user) =>
      user.email.toLowerCase() === cleanEmail && user.password === password,
  );

  if (!foundUser) {
    return {
      ok: false,
      message: 'Correo o contraseña incorrectos',
    };
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));

  return {
    ok: true,
    user: foundUser,
  };
};

export const getCurrentUser = async () => {
  const savedUser = localStorage.getItem(CURRENT_USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
};

export const updateCurrentUser = async (updatedData) => {
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const updatedUsers = users.map((user) => {
    if (user.id === currentUser.id) {
      return {
        ...user,
        ...updatedData,
      };
    }
    return user;
  });

  const updatedUser = {
    ...currentUser,
    ...updatedData,
  };

  await saveUsers(updatedUsers);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};

export const logoutUser = async () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};
