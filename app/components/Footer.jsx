
 const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-t from-[#0a0a0a] to-[#111111] border-t border-[#1F242B]">
  <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
    
    {/* Left */}
    <p className="text-sm text-gray-400">
      © {new Date().getFullYear()} Sprintly. All rights reserved.
    </p>

    {/* Right */}
    <div className="flex items-center gap-6 text-sm">
      <a
        href="#"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Privacy
      </a>
      <a
        href="#"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Terms
      </a>
      <a
        href="#"
        className="text-gray-400 hover:text-white transition-colors"
      >
        Contact
      </a>
    </div>
  </div>
</footer>

  )
}

export default Footer;
