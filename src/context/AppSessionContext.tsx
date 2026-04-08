import { createContext, useContext } from "react";
import {
	type AppSession,
	DEFAULT_APP_SESSION,
} from "../services/AppSessionService";

const AppSessionContext = createContext<AppSession>(DEFAULT_APP_SESSION);

export const AppSessionProvider = AppSessionContext.Provider;

export const useAppSession = () => useContext(AppSessionContext);
