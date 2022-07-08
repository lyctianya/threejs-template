import React, { useEffect } from 'react'
import logo from './logo.svg'
import './App.css'
import OceanView from './three/ocean'
import CloudView from './three/cloud'

function App() {
    let created = false
    useEffect(() => {
        if (!created) {
            new CloudView('Painter')
        }
        created = true
    }, [])
    return (
        <div className="App">
            <div className="FullPage" id="Painter"></div>
            {/* <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header> */}
        </div>
    )
}

export default App
