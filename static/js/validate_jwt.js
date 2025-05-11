export function logout() {
  localStorage.removeItem('jwt');
  window.location.href = '/';
}

export function isLoggedIn() {
  return !!localStorage.getItem('jwt');
}

export function getJwt() {
  return localStorage.getItem('jwt');
}
