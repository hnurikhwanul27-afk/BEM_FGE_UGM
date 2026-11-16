import { createContext, useContext } from "react";
export const Ctx = createContext(null);   // { S, setS }
export const GoCtx = createContext(null); // fungsi navigasi dengan transisi tirai
export const useSite = () => useContext(Ctx);
