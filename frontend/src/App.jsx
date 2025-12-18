import Display from "./components/Display"
import Sidebar from "./components/Sidebar"

function App() {

  return (
    <div className="bg-black w-full min-h-screen md:h-[100vh] flex flex-col md:flex-row">
      <div className="md:w-[18%] overflow-y-hidden"><Sidebar/></div>
      <div className="md:w-[82%]"><Display/></div>
    </div>
  )
}

export default App
