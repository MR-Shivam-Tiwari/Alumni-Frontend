import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import storePromise from "./store";
//import 'react-loading-skeleton/dist/skeleton.css';
import { tailChase } from 'ldrs'

tailChase.register();



function AppLoader() {
  const [isLoading, setLoading] = useState(true);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      const storeInstance = await storePromise;
      setLoading(false);
      setStore(storeInstance);
    };
    initialize();
  }, []);

  if (isLoading || !store) {
    return (
      <div className="loading-container" style={{display:'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
        <l-tail-chase size="40" speed="1.75" color="#174873"></l-tail-chase>
      </div>
    );
  }

  return (
    //<React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    //</React.StrictMode>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<AppLoader />);
reportWebVitals();
