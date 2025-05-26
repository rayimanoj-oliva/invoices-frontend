import {createContext, useState, useContext} from "react";

const UserContext = createContext({
    username: null,
    setUsername: ()=>{},
});

const UserProvider = UserContext.Provider;
function useUser() {
    return useContext(UserContext);
}

export {UserProvider, useUser};