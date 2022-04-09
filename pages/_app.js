import '../styles/globals.css'
import {useState} from 'react'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  const [index, setIndex] = useState(0)
  return(
    <div style={{height: '100vh'}} className="bg-blue-800">
      <nav className="shadow-xl shadow-gray-900 p-6 bg-gradient-to-br from-indigo-900 to-blue-900 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
        <p className="text-white text-4xl font-bold">Crypto Ape Sea</p>
        <div className="flex mt-4">
          <div  style={{ height: '30px', width:'100px', marginRight: '30px',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} className= {index == 0 ? "shadow-xl shadow-black text-black bg-white rounded-lg" : "text-white rounded-lg"} onClick={() => setIndex(0)}>
          <Link href="/">
            <a className="text-center">
              Home
            </a>
          </Link>
          </div>
          <div  style={{ height: '30px', width:'200px', marginRight: '30px',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} className= {index == 1 ? "shadow-xl shadow-black text-black bg-white rounded-lg" : "text-white rounded-lg"} onClick={() => setIndex(1)}>
          <Link href="/create-item">
            <a className="text-center">
              Create Digital Asset
            </a>
          </Link>
          </div>
          <div  style={{ height: '30px', width:'200px', marginRight: '30px',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} className= {index == 2 ? "shadow-xl shadow-black text-black bg-white rounded-lg" : "text-white rounded-lg"} onClick={() => setIndex(2)}>
          <Link href="/my-assets">
            <a className="text-center">
              My Digital Assets
            </a>
          </Link>
          </div>
          <div  style={{ height: '30px', width:'200px', marginRight: '30px',display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}} className= {index == 3 ? "shadow-xl shadow-black text-black bg-white rounded-lg" : "text-white rounded-lg"} onClick={() => setIndex(3)}>
          <Link href="/creator-dashboard">
            <a className="text-center">
              Creator Dashboard
            </a>
          </Link>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
