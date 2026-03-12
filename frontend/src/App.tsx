import { CssBaseline } from "@mui/material";
import { useWebSocket } from "./hooks/useWebSocket";
import MyRouter from "./router/myRouter";

function App() {
  useWebSocket();
  return (
    <>
      <CssBaseline />
      <MyRouter />
    </>
  );
}

export default App;
