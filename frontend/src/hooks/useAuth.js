import { useState } from 'react';

const API_URL = 'http://localhost:8080';

const SESSION_KEY = 'kisanmitra_session_v1';
const USER_KEY = 'kisanmitra_user';
const JWT_KEY = 'kisanmitra_jwt';
const USER_ID_KEY = 'kisanmitra_user_id';

export const DEFAULT_MOCK_USER = {
  name: "Ramesh Kumar",
  email: "ramesh@gmail.com",
  mobile: "9876543210",
  photo: null,
  uid: "demo-001"
};


export function useAuth() {

  // =========================================================
  // LOAD EXISTING SESSION
  // =========================================================

  const [currentUser, setCurrentUser] = useState(() => {

    try {

      const storedUser =
        localStorage.getItem(USER_KEY);

      const storedJwt =
        localStorage.getItem(JWT_KEY);

      if (storedUser && storedJwt) {
        return JSON.parse(storedUser);
      }

    } catch (error) {

      console.warn(
        'Failed to load user session',
        error
      );

    }

    return null;
  });


  const [isLoading, setIsLoading] =
    useState(false);

  const [authError, setAuthError] =
    useState('');


  const [lockoutStatus] =
    useState({
      locked: false,
      remainingSeconds: 0
    });


  // =========================================================
  // CREATE SESSION
  // =========================================================

  const createSession = (user, token) => {

    const sessionUser = {

      id: user.id,

      name: user.name,

      mobile: user.mobile,

      email: user.email || '',

      photo: null,

      uid: String(user.id)
    };


    try {

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(sessionUser)
      );


      localStorage.setItem(
        JWT_KEY,
        token
      );


      localStorage.setItem(
        USER_ID_KEY,
        String(user.id)
      );


      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          user: sessionUser,
          token: token,
          createdAt: Date.now()
        })
      );


    } catch (error) {

      console.warn(
        'Failed to save session',
        error
      );
    }


    setCurrentUser(sessionUser);

    setAuthError('');
  };


  // =========================================================
  // SIGN IN
  // =========================================================

  const signIn = async (
    identifier,
    password
  ) => {

    setAuthError('');
    setIsLoading(true);


    try {

      const mobile =
        String(identifier).trim();


      const response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              mobile: mobile,
              password: password
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          typeof data === 'string'
            ? data
            : 'Invalid mobile number or password'
        );
      }


      // Save complete session
      createSession(
        data,
        data.token
      );


      return true;


    } catch (error) {

      console.error(
        'Login error:',
        error
      );


      setAuthError(
        error.message ||
        'Login failed'
      );


      return false;


    } finally {

      setIsLoading(false);
    }
  };


  // =========================================================
  // SIGN UP
  // =========================================================

  const signUp = async (
    name,
    mobile,
    password,
    confirmPassword
  ) => {

    setAuthError('');
    setIsLoading(true);


    try {

      // Check passwords
      if (
        password !==
        confirmPassword
      ) {

        throw new Error(
          'Passwords do not match'
        );
      }


      const cleanName =
        String(name).trim();

      const cleanMobile =
        String(mobile).trim();


      // -----------------------------------------------------
      // REGISTER
      // -----------------------------------------------------

      const registerResponse =
        await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              name: cleanName,
              mobile: cleanMobile,
              password: password
            })
          }
        );


      const registerData =
        await registerResponse.text();


      if (!registerResponse.ok) {

        throw new Error(
          registerData ||
          'Registration failed'
        );
      }


      // -----------------------------------------------------
      // AUTOMATIC LOGIN
      // -----------------------------------------------------

      const loginResponse =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              mobile: cleanMobile,
              password: password
            })
          }
        );


      const loginData =
        await loginResponse.json();


      if (!loginResponse.ok) {

        throw new Error(
          typeof loginData === 'string'
            ? loginData
            : 'Registration successful, but automatic login failed'
        );
      }


      // Save session + user ID + JWT
      createSession(
        loginData,
        loginData.token
      );


      return true;


    } catch (error) {

      console.error(
        'Registration error:',
        error
      );


      setAuthError(
        error.message ||
        'Registration failed'
      );


      return false;


    } finally {

      setIsLoading(false);
    }
  };


  // =========================================================
  // DEMO LOGIN
  // =========================================================

  const demoLogin = async (
    customUser = null
  ) => {

    const userToSave =
      customUser ||
      DEFAULT_MOCK_USER;


    try {

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(userToSave)
      );

    } catch (error) {

      console.warn(
        'Failed to save demo user',
        error
      );
    }


    setCurrentUser(userToSave);

    return userToSave;
  };


  // =========================================================
  // SIGN OUT
  // =========================================================

  const signOut = () => {

    try {

      localStorage.removeItem(
        USER_KEY
      );


      localStorage.removeItem(
        SESSION_KEY
      );


      localStorage.removeItem(
        JWT_KEY
      );


      // Important:
      // Remove only the current login reference.
      // Database data is NOT deleted.
      localStorage.removeItem(
        USER_ID_KEY
      );


    } catch (error) {

      console.warn(
        'Failed to clear session',
        error
      );
    }


    setCurrentUser(null);

    setAuthError('');
  };


  // =========================================================
  // RETURN
  // =========================================================

  return {

    currentUser,

    isAuthenticated:
      !!currentUser,

    isLoading,

    authError,

    setAuthError,

    lockoutStatus,

    signIn,

    signUp,

    demoLogin,

    signOut
  };
}