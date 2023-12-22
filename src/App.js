import './App.css';
import MyInput from "./components/MyInput";


function App() {

    return (
        <div className="App">
            <div className='flex justify-center flex-col items-center'>
                <h1 className='text-center my-8 text-3xl'>Convertor UAH</h1>
                <MyInput />
            </div>
        </div>
    );
}

export default App;
