
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Menu, X, ExternalLink, Trash2, Plus, LogOut, Settings, 
  Gamepad2, Scissors, Sparkles, Send, Youtube, MessageCircle, 
  Instagram, Heart, User, CheckCircle2, Clock, Calendar
} from 'lucide-react';
import { 
  AboutContent, Project, Edit, Message 
} from './types';
import { 
  INITIAL_ABOUT, INITIAL_PROJECTS, INITIAL_EDITS, SOCIAL_LINKS 
} from './constants';

// --- Utility Components ---

const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-widest neon-text mb-4">
      {title}
    </h2>
    {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
    <div className="w-24 h-1 bg-neonGreen mx-auto mt-4 rounded-full neon-glow"></div>
  </div>
);

// --- Main App Component ---

export default function App() {
  // State Management
  const [about, setAbout] = useState<AboutContent>(INITIAL_ABOUT);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [edits, setEdits] = useState<Edit[]>(INITIAL_EDITS);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Admin Panel Logic
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  // Handle Logo Clicks for Admin Access
  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks === 3) {
      setShowPasswordModal(true);
      setLogoClicks(0);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'luhvreubenyay') {
      setIsAdminLoggedIn(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setIsAdminMode(true);
    } else {
      alert('Incorrect Password!');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      ...contactForm,
      date: new Date().toLocaleString()
    };
    setMessages(prev => [newMessage, ...prev]);
    setFormStatus('success');
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus('idle'), 5000);
  };

  // Admin Actions
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id));
  const addProject = () => {
    const newProj: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Project',
      description: 'Project details here...',
      status: 'Planned'
    };
    setProjects(prev => [...prev, newProj]);
  };

  const deleteEdit = (id: string) => setEdits(prev => prev.filter(e => e.id !== id));
  const addEdit = () => {
    const newEdit: Edit = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Edit Thumbnail',
      thumbnail: 'https://picsum.photos/seed/new/600/400',
      videoUrl: '#'
    };
    setEdits(prev => [...prev, newEdit]);
  };

  const deleteMessage = (id: string) => setMessages(prev => prev.filter(m => m.id !== id));

  return (
    <div className="bg-black text-white min-h-screen selection:bg-neonGreen selection:text-black">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neonGreen/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={handleLogoClick}>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neonGreen neon-glow transition-transform group-active:scale-95 group-hover:rotate-12">
              <img 
                src="https://static.wikia.nocookie.net/c4276565-66a0-4efb-a31a-c995fc4317e0/scale-to-width/370" 
                alt="LuhvReuben Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter hidden sm:block">
              Luhv<span className="text-neonGreen">Reuben</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
            <a href="#about" className="hover:text-neonGreen transition-colors">About</a>
            <a href="#projects" className="hover:text-neonGreen transition-colors">Projects</a>
            <a href="#edits" className="hover:text-neonGreen transition-colors">Edits</a>
            <a href="#contact" className="hover:text-neonGreen transition-colors">Contact</a>
            <a href="#socials" className="hover:text-neonGreen transition-colors">Socials</a>
            {isAdminLoggedIn && (
              <button 
                onClick={() => setIsAdminMode(!isAdminMode)}
                className="bg-neonGreen text-black px-4 py-1 rounded hover:opacity-80 transition-opacity"
              >
                {isAdminMode ? 'View Site' : 'Admin Panel'}
              </button>
            )}
          </div>

          <div className="md:hidden">
            <Menu className="w-8 h-8 text-neonGreen" />
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      {!isAdminMode ? (
        <main>
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://picsum.photos/seed/gaming/1920/1080" 
                className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Hero Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            </div>
            
            <div className="relative z-10 text-center px-6">
              <div className="flex justify-center gap-4 mb-6">
                <Gamepad2 className="w-10 h-10 text-neonGreen animate-bounce" />
                <Scissors className="w-10 h-10 text-neonGreen animate-pulse" />
                <Sparkles className="w-10 h-10 text-neonGreen animate-spin-slow" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 neon-text tracking-tighter">
                HEY, I'M LUHVREUBEN! 🎮✂️✨
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-medium">
                16-year-old creator, gamer, and editor crafting visual magic and digital adventures.
              </p>
              <div className="mt-10">
                <a 
                  href="#about"
                  className="px-8 py-4 bg-neonGreen text-black font-black uppercase tracking-widest rounded-full hover:scale-110 transition-transform neon-glow inline-block"
                >
                  Enter My World
                </a>
              </div>
            </div>
          </section>

          {/* About Me Section */}
          <section id="about" className="py-24 px-6 bg-darkBg border-y border-neonGreen/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-neonGreen/20 rounded-full blur-2xl group-hover:bg-neonGreen/40 transition-all"></div>
                  <img 
                    src="https://static.wikia.nocookie.net/c4276565-66a0-4efb-a31a-c995fc4317e0/scale-to-width/370" 
                    alt="LuhvReuben" 
                    className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-neonGreen animate-spin-slow relative z-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <SectionTitle title="About Me" />
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p className="text-2xl font-bold text-white mb-4">
                    Hi! I'm {about.age} and I'm {about.orientation}.
                  </p>
                  <p>{about.bio}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                    <div className="bg-cardBg p-6 rounded-2xl border border-neonGreen/10">
                      <h4 className="text-neonGreen font-black uppercase mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5" /> Fave Foods
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {about.foods.map(food => (
                          <span key={food} className="px-3 py-1 bg-black rounded-lg text-sm border border-white/10">{food}</span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-cardBg p-6 rounded-2xl border border-neonGreen/10">
                      <h4 className="text-neonGreen font-black uppercase mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5" /> Fave Drink
                      </h4>
                      <span className="px-3 py-1 bg-black rounded-lg text-sm border border-white/10">{about.drink}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upcoming Projects Section */}
          <section id="projects" className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <SectionTitle title="Upcoming Projects" subtitle="What I'm currently building and playing" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map(project => (
                  <div key={project.id} className="group bg-cardBg rounded-3xl p-8 border border-neonGreen/10 hover:border-neonGreen/50 transition-all hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-neonGreen/10 rounded-xl text-neonGreen">
                        {project.status === 'Completed' ? <CheckCircle2 /> : project.status === 'In Progress' ? <Clock /> : <Calendar />}
                      </div>
                      <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                        project.status === 'Completed' ? 'bg-green-500/20 text-green-500' : 
                        project.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 group-hover:text-neonGreen transition-colors uppercase">{project.name}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">{project.description}</p>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${
                        project.status === 'Completed' ? 'w-full bg-green-500' : 
                        project.status === 'In Progress' ? 'w-2/3 bg-yellow-500' : 'w-1/4 bg-blue-500'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Edits Section */}
          <section id="edits" className="py-24 px-6 bg-cardBg/50">
            <div className="max-w-7xl mx-auto">
              <SectionTitle title="Edits" subtitle="Click to view the magic" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {edits.map(edit => (
                  <div key={edit.id} className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
                    <img src={edit.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={edit.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">{edit.title}</h4>
                      <div className="flex items-center gap-2 text-neonGreen text-sm opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest">
                        Watch Now <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-neonGreen text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Scissors className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="Contact Me" />
              <div className="bg-cardBg border border-neonGreen/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Send className="w-32 h-32 text-neonGreen" />
                </div>
                
                {formStatus === 'success' ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-neonGreen/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-neonGreen" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-gray-400">Thanks for reaching out, I'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-black uppercase text-gray-400 mb-2">Name</label>
                        <input 
                          required
                          type="text" 
                          value={contactForm.name}
                          onChange={e => setContactForm({...contactForm, name: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-neonGreen outline-none transition-colors"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-black uppercase text-gray-400 mb-2">Email</label>
                        <input 
                          required
                          type="email" 
                          value={contactForm.email}
                          onChange={e => setContactForm({...contactForm, email: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-neonGreen outline-none transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-black uppercase text-gray-400 mb-2">Message</label>
                      <textarea 
                        required
                        rows={5}
                        value={contactForm.message}
                        onChange={e => setContactForm({...contactForm, message: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-neonGreen outline-none transition-colors resize-none"
                        placeholder="What's up?"
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-neonGreen text-black font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      Send Transmission <Send className="w-5 h-5" />
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Or email me directly: <a href="mailto:contactluhvreuben@gmail.com" className="text-neonGreen hover:underline">contactluhvreuben@gmail.com</a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Socials Section */}
          <section id="socials" className="py-24 px-6 bg-neonGreen text-black">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tighter">Follow The Journey</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {SOCIAL_LINKS.map(social => (
                  <a 
                    key={social.name}
                    href={social.url}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-black text-neonGreen flex items-center justify-center transition-transform group-hover:scale-125 group-hover:-rotate-12 shadow-xl">
                      {social.icon}
                    </div>
                    <span className="font-black uppercase tracking-widest text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* Admin Mode Interface */
        <div className="pt-24 px-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12 bg-cardBg p-6 rounded-2xl border border-neonGreen/20">
              <div className="flex items-center gap-4">
                <Settings className="w-8 h-8 text-neonGreen" />
                <div>
                  <h1 className="text-2xl font-black uppercase">Dashboard</h1>
                  <p className="text-gray-400 text-sm">Welcome back, Boss.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAdminMode(false)}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-bold uppercase text-sm"
              >
                <LogOut className="w-4 h-4" /> Exit Admin
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Edit About Me */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><User className="text-neonGreen" /> Edit About Content</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs uppercase text-gray-500 font-bold">Bio Content</label>
                    <textarea 
                      value={about.bio}
                      onChange={e => setAbout({...about, bio: e.target.value})}
                      rows={4}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 mt-1 outline-none focus:border-neonGreen"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase text-gray-500 font-bold">Age</label>
                      <input 
                        type="text" 
                        value={about.age}
                        onChange={e => setAbout({...about, age: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-gray-500 font-bold">Orientation</label>
                      <input 
                        type="text" 
                        value={about.orientation}
                        onChange={e => setAbout({...about, orientation: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Manage Projects */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><Gamepad2 className="text-neonGreen" /> Projects</h3>
                  <button onClick={addProject} className="p-2 bg-neonGreen text-black rounded-lg"><Plus /></button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {projects.map(proj => (
                    <div key={proj.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div>
                        <input 
                          className="bg-transparent font-bold focus:text-neonGreen outline-none" 
                          value={proj.name} 
                          onChange={e => setProjects(projects.map(p => p.id === proj.id ? {...p, name: e.target.value} : p))}
                        />
                        <p className="text-xs text-gray-500">{proj.status}</p>
                      </div>
                      <button onClick={() => deleteProject(proj.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Manage Edits */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase flex items-center gap-2"><Scissors className="text-neonGreen" /> Edits Gallery</h3>
                  <button onClick={addEdit} className="p-2 bg-neonGreen text-black rounded-lg"><Plus /></button>
                </div>
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                  {edits.map(edit => (
                    <div key={edit.id} className="relative group rounded-xl overflow-hidden aspect-square">
                      <img src={edit.thumbnail} className="w-full h-full object-cover" alt="" />
                      <button 
                        onClick={() => deleteEdit(edit.id)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages Inbox */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><MessageCircle className="text-neonGreen" /> Contact Inbox ({messages.length})</h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                      No transmissions received yet.
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-2 relative group">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-neonGreen font-bold block">{msg.name}</span>
                            <span className="text-xs text-gray-500">{msg.email} • {msg.date}</span>
                          </div>
                          <button onClick={() => deleteMessage(msg.id)} className="text-red-500 p-2"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <p className="text-sm text-gray-300 bg-white/5 p-3 rounded-lg italic">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-cardBg border border-neonGreen/30 rounded-3xl p-10 max-w-md w-full shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-neonGreen/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-neonGreen/30">
                <Settings className="w-10 h-10 text-neonGreen" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-widest neon-text">Restricted Access</h2>
              <p className="text-gray-400 mt-2">Enter the admin terminal code to proceed.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input 
                autoFocus
                type="password"
                placeholder="Password..."
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 focus:border-neonGreen outline-none text-center font-mono text-xl tracking-[0.5em]"
              />
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-4 bg-white/10 text-white font-black uppercase rounded-xl hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-neonGreen text-black font-black uppercase rounded-xl hover:opacity-90 neon-glow transition-all"
                >
                  Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="flex items-center gap-4">
            <img 
              src="https://static.wikia.nocookie.net/c4276565-66a0-4efb-a31a-c995fc4317e0/scale-to-width/370" 
              className="w-16 h-16 rounded-full border border-neonGreen neon-glow"
              alt="Footer Logo"
            />
            <span className="text-3xl font-black uppercase tracking-tighter">Luhv<span className="text-neonGreen">Reuben</span></span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 font-black uppercase tracking-widest text-sm">
            <a href="#about" className="hover:text-neonGreen transition-colors">About Me</a>
            <a href="#projects" className="hover:text-neonGreen transition-colors">Projects</a>
            <a href="#edits" className="hover:text-neonGreen transition-colors">Edits</a>
            <a href="#contact" className="hover:text-neonGreen transition-colors">Contact</a>
            <a href="#socials" className="hover:text-neonGreen transition-colors">Socials</a>
          </div>

          <div className="text-gray-500 font-medium">
            &copy; 2026 LuhvReuben &bull; Always Evolving <span className="text-neonGreen">🚀</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
