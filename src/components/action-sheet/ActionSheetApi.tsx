import { createContext, useContext } from "react";
import { ActionSheetContextType } from "../types/types";



export const ActionSheetContext = createContext<ActionSheetContextType | null>(null);



export const useActionSheet = (): ActionSheetContextType => {
  const context = useContext(ActionSheetContext);
  if (!context) {
    throw new Error(
      "useActionSheet must be used within an ActionSheetProvider",
    );
  }
  return context;
};
