
export default function Home() {
  return (
    <div className="min-h-screen bg-dark1 text-white">

      <nav className="flex items-center justify-between px-8 py-4 bg-dark3 shadow-lg">
        <h1 className="text-2xl font-bold text-primary">MyPortfolio</h1>
        <div className="space-x-6 text-grayish">
          <a href="#about" className="hover:text-primary transition">About</a>
          <a href="#projects" className="hover:text-primary transition">Projects</a>
          <a href="#contact" className="hover:text-primary transition">Contact</a>
        </div>
      </nav>

      <section className="flex flex-col justify-center items-start px-10 md:px-20 h-[80vh] bg-dark1">
        <h2 className="text-5xl font-extrabold mb-4">
          Hi, I'm <span className="text-primary">Christian</span>
        </h2>
        <p className="text-lg max-w-xl text-grayish">
          A passionate developer crafting modern, smooth, and efficient web experiences.
        </p>
        <button className="mt-6 px-6 py-3 bg-primary text-dark1 font-semibold rounded-xl hover:opacity-90 transition">
          View My Work
        </button>
      </section>

      <section id="projects" className="px-10 md:px-20 py-20 bg-dark3">
        <h3 className="text-3xl font-bold mb-10 text-primary">Projects</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-dark2 p-6 rounded-2xl shadow-md hover:scale-[1.02] transition">
              <h4 className="text-xl mb-2">Project {i}</h4>
              <p className="text-grayish text-sm">Short description here.</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="px-10 md:px-20 py-16 bg-dark1 text-center">
        <h3 className="text-3xl font-bold text-primary mb-6">Get In Touch</h3>
        <p className="text-grayish max-w-xl mx-auto mb-8">
          Want to collaborate, ask something, or just say hi? My inbox is always open.
        </p>
        <button className="px-6 py-3 bg-primary text-dark1 font-semibold rounded-xl hover:opacity-90 transition">
          Contact Me
        </button>
      </section>
    </div>
  );
}