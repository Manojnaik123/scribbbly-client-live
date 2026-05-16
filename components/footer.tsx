export default function Footer() {
  return (
    <footer className="w-full h-10 bg-[#1a1a3e] border-t-4 border-[#ffd700] flex items-center justify-between px-6 mt-auto">
      <span className="font-['Press_Start_2P'] text-[7px] text-[#00ff41]">
        © 1994 BIT-PERFECT SYSTEMS
      </span>
      {/* <div className="flex gap-6">
        {['TERMS', 'PRIVACY', 'CONTACT'].map((link) => (
          <a key={link} href="#" className="font-['Press_Start_2P'] text-[7px] text-[#9090b0] hover:text-[#00ff41] transition-none">
            {link}
          </a>
        ))}
      </div> */}
    </footer>
  )
}
