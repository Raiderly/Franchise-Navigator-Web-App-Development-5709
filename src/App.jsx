import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Browse from './pages/Browse'
import Compare from './pages/Compare'
import Insights from './pages/Insights'
import Saved from './pages/Saved'
import AskAI from './pages/AskAI'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
          <Route path="compare" element={<Compare />} />
          <Route path="insights" element={<Insights />} />
          <Route path="saved" element={<Saved />} />
          <Route path="ask-ai" element={<AskAI />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App