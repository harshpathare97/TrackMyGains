import React from 'react'
import Link from 'next/link'; 

function Footer() {
  return (
      <footer className="text-center p-4 bg-slate-900 text-white">
        <p>Made with ❤️ by Harsh Pathare</p>
          <Link href="mailto:hpathare97@gmail.com" className="hover:text-gray-400">
            Contact Me
          </Link>
      </footer>
  )
}

export default Footer
