import { useContext } from "react";
import { AuthContext } from "../auth.context";
import {login , register,logout,getMe} from "../services/auth.api"
import { useEffect } from "react";
export const useAuth = () => {
    const context = useContext(AuthContext);
    const {user,loading,setUser,setLoading} = context;

    const handleLogin = async({email,password}) => {
        try {
            setLoading(true);
            const response = await login({email,password});
            setUser(response.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async({username,email,password}) => {
        try {
            setLoading(true);
            const response = await register({username,email,password});
            setUser(response.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = async() => {
        try {
            setLoading(true);
            const response = await logout();
            setUser(null);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleGetMe = async() => {
        try {
            setLoading(true);
            const response = await getMe();
            setUser(response.user);
            setLoading(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await getMe();
        setUser(response.user);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

    return {
        user,
        loading,
        setUser,
        setLoading,
        handleLogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }
}