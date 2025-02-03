import "./App.css";
import HeaderComp from "./components/HeaderComp.jsx";
import { MyProvider } from "./utils/Myprovider.jsx";

function App() {
  return (
    <>
    <MyProvider>
    <HeaderComp />
    </MyProvider>

    </>
  );
}
export default App;

