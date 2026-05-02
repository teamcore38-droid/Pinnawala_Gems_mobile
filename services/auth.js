import API from './api';

export async function loginUser({ email, password }) {
  // Hardcoded credentials for demo
  if (email === 'user@example.com' && password === 'user123') {
    return { success: true, message: 'User logged in successfully' };
  } else {
    throw new Error('Invalid user credentials');
  }
}

export async function loginAdmin({ email, password }) {
  // Hardcoded credentials for demo
  if (email === 'admin@example.com' && password === 'admin123') {
    return { success: true, message: 'Admin logged in successfully' };
  } else {
    throw new Error('Invalid admin credentials');
  }
}
