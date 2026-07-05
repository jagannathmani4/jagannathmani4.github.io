export const DEFAULT_ADMIN_USER = {
  id: 1,
  email: 'jagannathmani4@gmail.com',
  password: 'Jagannath@2005',
  displayName: 'Jagannath',
  isAdmin: true,
  role: 'admin',
  verified: true,
  createdAt: '2026-07-05'
};

export function ensureDefaultAdminUser() {
  const users = JSON.parse(localStorage.getItem('portfolioUsers') || '[]');
  const adminIndex = users.findIndex((user) => user.email === DEFAULT_ADMIN_USER.email);

  if (adminIndex >= 0) {
    users[adminIndex] = {
      ...users[adminIndex],
      ...DEFAULT_ADMIN_USER
    };
  } else {
    users.unshift({ ...DEFAULT_ADMIN_USER });
  }

  localStorage.setItem('portfolioUsers', JSON.stringify(users));

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (currentUser?.email === DEFAULT_ADMIN_USER.email) {
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      ...DEFAULT_ADMIN_USER
    }));
  }
}
