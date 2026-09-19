import { useState } from 'react';

const API_URL = 'https://kisanmitra-07c4.onrender.com';

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

  const [alreadyRegistered, setAlreadyRegistered] =
    useState(false);

  const clearAlreadyRegistered = () => {
    setAlreadyRegistered(false);
  };

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
    setAlreadyRegistered(false);
  };


  // =========================================================
  // SIGN IN
  // =========================================================

  const signIn = async (
    identifier,
    password
  ) => {

    setAuthError('');
    setAlreadyRegistered(false);
    setIsLoading(true);

    const mobile =
      String(identifier || '').trim();

    if (!mobile || !password) {
      setAuthError('Please enter both mobile number and password');
      setIsLoading(false);
      return false;
    }

    let response;
    try {
      response =
        await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              mobile: mobile,
              password: password
            })
          }
        );
    } catch (networkError) {
      console.error(
        'Login network error:',
        networkError
      );
      setAuthError('Unable to connect to the server. Please try again.');
      setIsLoading(false);
      return false;
    }

    try {
      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (data && data.token) {
          createSession(
            data,
            data.token
          );
          return true;
        } else {
          setAuthError('Unable to connect to the server. Please try again.');
          return false;
        }
      }

      // -----------------------------------------------------
      // FAILED LOGIN HANDLING (HTTP 401, etc.)
      // -----------------------------------------------------
      let responseText = '';
      try {
        responseText = await response.text();
      } catch {
        responseText = '';
      }

      const lowerText = responseText.toLowerCase();

      // Check if backend message directly specifies password error
      if (
        (lowerText.includes('password') && !lowerText.includes('mobile')) ||
        lowerText.includes('incorrect password') ||
        lowerText.includes('wrong password')
      ) {
        setAuthError('Incorrect password. Please try again.');
        return false;
      }

      // Check if backend message directly specifies unregistered user
      if (
        lowerText.includes('not found') ||
        lowerText.includes('unregistered') ||
        lowerText.includes('no account')
      ) {
        setAuthError('No account found with this mobile number. Please sign up first.');
        return false;
      }

      // When response is 401 or "Invalid mobile number or password":
      // Determine whether the mobile number exists in the backend
      try {
        const checkResponse =
          await fetch(
            `${API_URL}/api/auth/register`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ mobile: mobile })
            }
          );

        let checkText = '';
        try {
          checkText = await checkResponse.text();
        } catch {
          checkText = '';
        }

        if (
          checkResponse.status === 400 &&
          checkText.includes('Mobile number already registered')
        ) {
          // Mobile number exists in the database -> wrong password
          setAuthError('Incorrect password. Please try again.');
        } else {
          // Mobile number does not exist in the database
          setAuthError('No account found with this mobile number. Please sign up first.');
        }
      } catch {
        setAuthError('Incorrect password. Please try again.');
      }

      return false;

    } catch (error) {
      console.error(
        'Login error:',
        error
      );
      setAuthError('Unable to connect to the server. Please try again.');
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
    setAlreadyRegistered(false);
    setIsLoading(true);

    try {
      // Check passwords match
      if (
        password !==
        confirmPassword
      ) {
        const err = 'Passwords do not match';
        setAuthError(err);
        return { success: false, error: err };
      }

      const cleanName =
        String(name || '').trim();

      const cleanMobile =
        String(mobile || '').trim();

      if (!cleanName || !cleanMobile || !password) {
        const err = 'Please fill in all fields';
        setAuthError(err);
        return { success: false, error: err };
      }

      // -----------------------------------------------------
      // REGISTER
      // -----------------------------------------------------
      let registerResponse;
      try {
        registerResponse =
          await fetch(
            `${API_URL}/api/auth/register`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: cleanName,
                mobile: cleanMobile,
                password: password
              })
            }
          );
      } catch (netErr) {
        console.error(
          'Registration network error:',
          netErr
        );
        const err = 'Unable to connect to the server. Please try again.';
        setAuthError(err);
        return { success: false, error: err };
      }

      let registerData = '';
      try {
        registerData = await registerResponse.text();
      } catch {
        registerData = '';
      }

      // Handle ALREADY REGISTERED (HTTP 400 with "Mobile number already registered")
      if (
        registerResponse.status === 400 &&
        registerData.includes('Mobile number already registered')
      ) {
        setAlreadyRegistered(true);
        return {
          success: false,
          alreadyRegistered: true,
          error: 'User already registered. Please login to continue.'
        };
      }

      if (!registerResponse.ok) {
        const err = registerData || 'Registration failed';
        setAuthError(err);
        return {
          success: false,
          error: err
        };
      }

      // -----------------------------------------------------
      // AUTOMATIC LOGIN
      // -----------------------------------------------------
      try {
        const loginResponse =
          await fetch(
            `${API_URL}/api/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                mobile: cleanMobile,
                password: password
              })
            }
          );

        if (loginResponse.ok) {
          const loginData =
            await loginResponse.json();

          createSession(
            loginData,
            loginData.token
          );

          return { success: true };
        } else {
          setAuthError('Registration successful. Please sign in.');
          return { success: true, autoLoginFailed: true };
        }
      } catch {
        setAuthError('Registration successful. Please sign in.');
        return { success: true, autoLoginFailed: true };
      }

    } catch (error) {
      console.error(
        'Registration error:',
        error
      );
      const err = error.message || 'Registration failed';
      setAuthError(err);
      return { success: false, error: err };

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

    alreadyRegistered,

    clearAlreadyRegistered,

    lockoutStatus,

    signIn,

    signUp,

    demoLogin,

    signOut
  };
}