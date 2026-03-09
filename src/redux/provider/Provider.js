import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Store, { persistor } from "../store/store";
import { SnackbarProvider } from "notistack";
import AppLoader from "../../components/common/AppLoader";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { NewsLetter } from "../../components/modals/NewsLetter";


const customTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#f8e7f0',
          100: '#E8DCFC',
          200: '#da94b4',
          300: '#c96b94',
          400: '#b94278',
          500: '#185ea5', // Your custom primary color
          600: '#49193c',
          700: '#3a1431',
          800: '#2c0e25',
          900: '#1d0919',
        },
        // Add other color definitions as needed (e.g., secondary, danger)
      },
    },
  },
});

export function StoreProviders({ children }) {
  const snackbarAnchorOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
  };

  return (
    <CssVarsProvider theme={customTheme}>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider anchorOrigin={snackbarAnchorOrigin} autoHideDuration={3000}>
            <AppLoader />
            {/* <NewsLetter/> */}
            {children}
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </CssVarsProvider>
  );
}
