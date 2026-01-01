
import React, { useState, useEffect } from 'react';
import { 
  Menu, X, ExternalLink, Trash2, Plus, LogOut, Settings, 
  Gamepad2, Scissors, Sparkles, Send, Heart, User, CheckCircle2, 
  Clock, Calendar, Loader2
} from 'lucide-react';
import { 
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from './firebase-config';
import { AboutContent, Project, Edit, Message } from './types';
import { INITIAL_ABOUT, SOCIAL_LINKS } from './constants';

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
  const [projects, setProjects] = useState<Project[]>([]);
  const [edits, setEdits] = useState<Edit[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Admin Panel Logic
  const [logoClicks, setLogoClicks] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success'>('idle');

  // Firebase Real-time Sync
  useEffect(() => {
    // Sync About Me (Single Document)
    const aboutRef = doc(db, 'content', 'about');
    const unsubscribeAbout = onSnapshot(aboutRef, (docSnap) => {
      if (docSnap.exists()) {
        setAbout(docSnap.data() as AboutContent);
      } else {
        // Initialize if not exists
        setDoc(aboutRef, INITIAL_ABOUT);
      }
    });

    // Sync Projects
    const projectsRef = collection(db, 'projects');
    const unsubscribeProjects = onSnapshot(projectsRef, (snapshot) => {
      const projs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projs);
    });

    // Sync Edits
    const editsRef = collection(db, 'edits');
    const unsubscribeEdits = onSnapshot(editsRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Edit));
      setEdits(items);
    });

    // Sync Messages (Admin only)
    const messagesRef = collection(db, 'messages');
    const qMessages = query(messagesRef, orderBy('date', 'desc'));
    const unsubscribeMessages = onSnapshot(qMessages, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
    });

    return () => {
      unsubscribeAbout();
      unsubscribeProjects();
      unsubscribeEdits();
      unsubscribeMessages();
    };
  }, []);

  // Handle Scroll to Section
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'messages'), {
        ...contactForm,
        date: new Date().toISOString()
      });
      setFormStatus('success');
      setContactForm({ name: '', email: '', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (err) {
      alert('Error sending message. Please try again.');
    }
  };

  // Admin Database Actions
  const updateAboutDb = (newAbout: AboutContent) => {
    setDoc(doc(db, 'content', 'about'), newAbout);
  };

  const addProject = async () => {
    await addDoc(collection(db, 'projects'), {
      name: 'New Project',
      description: 'Project details here...',
      status: 'Planned'
    });
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    await updateDoc(doc(db, 'projects', id), updates);
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
  };

  const addEdit = async () => {
    await addDoc(collection(db, 'edits'), {
      title: 'New Edit',
      thumbnail: 'https://picsum.photos/seed/' + Math.random() + '/600/400',
      videoUrl: '#'
    });
  };

  const deleteEdit = async (id: string) => {
    await deleteDoc(doc(db, 'edits', id));
  };

  const deleteMessage = async (id: string) => {
    await deleteDoc(doc(db, 'messages', id));
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Edits', id: 'edits' },
    { name: 'Contact', id: 'contact' },
    { name: 'Socials', id: 'socials' }
  ];

  if (loading && projects.length === 0) {
    return (
      <div className="bg-black h-screen w-screen flex flex-col items-center justify-center text-neonGreen">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-black uppercase tracking-widest text-sm">Initialising Nexus...</p>
      </div>
    );
  }

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
            {navLinks.map(link => (
              <a 
                key={link.id}
                href={`#${link.id}`} 
                onClick={(e) => scrollToSection(e, link.id)}
                className="hover:text-neonGreen transition-colors"
              >
                {link.name}
              </a>
            ))}
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
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              {isMobileMenuOpen ? <X className="w-8 h-8 text-neonGreen" /> : <Menu className="w-8 h-8 text-neonGreen" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-neonGreen/20 p-6 flex flex-col gap-6 font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
            {navLinks.map(link => (
              <a key={link.id} href={`#${link.id}`} onClick={(e) => scrollToSection(e, link.id)} className="text-xl hover:text-neonGreen transition-colors">
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      {!isAdminMode ? (
        <main>
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://picsum.photos/seed/gaming/1920/1080" className="w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" alt="Hero" />
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
                <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="px-8 py-4 bg-neonGreen text-black font-black uppercase tracking-widest rounded-full hover:scale-110 transition-transform neon-glow inline-block">
                  Enter My World
                </a>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-24 px-6 bg-darkBg border-y border-neonGreen/10 scroll-mt-20">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-neonGreen/20 rounded-full blur-2xl group-hover:bg-neonGreen/40 transition-all"></div>
                  <img src="https://static.wikia.nocookie.net/c4276565-66a0-4efb-a31a-c995fc4317e0/scale-to-width/370" alt="LuhvReuben" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-4 border-neonGreen animate-spin-slow relative z-10" />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <SectionTitle title="About Me" />
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p className="text-2xl font-bold text-white mb-4">Hi! I'm {about.age} and I'm {about.orientation}.</p>
                  <p>{about.bio}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                    <div className="bg-cardBg p-6 rounded-2xl border border-neonGreen/10">
                      <h4 className="text-neonGreen font-black uppercase mb-4 flex items-center gap-2"><Heart className="w-5 h-5" /> Fave Foods</h4>
                      <div className="flex flex-wrap gap-2">
                        {about.foods.map(food => <span key={food} className="px-3 py-1 bg-black rounded-lg text-sm border border-white/10">{food}</span>)}
                      </div>
                    </div>
                    <div className="bg-cardBg p-6 rounded-2xl border border-neonGreen/10">
                      <h4 className="text-neonGreen font-black uppercase mb-4 flex items-center gap-2"><Send className="w-5 h-5" /> Fave Drink</h4>
                      <span className="px-3 py-1 bg-black rounded-lg text-sm border border-white/10">{about.drink}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-24 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
              <SectionTitle title="Upcoming Projects" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {projects.map(project => (
                  <div key={project.id} className="bg-cardBg rounded-3xl p-8 border border-neonGreen/10 hover:border-neonGreen/50 transition-all hover:-translate-y-2">
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-neonGreen/10 rounded-xl text-neonGreen">
                        {project.status === 'Completed' ? <CheckCircle2 /> : project.status === 'In Progress' ? <Clock /> : <Calendar />}
                      </div>
                      <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-white/5">{project.status}</span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase">{project.name}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">{project.description}</p>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-neonGreen ${project.status === 'Completed' ? 'w-full' : project.status === 'In Progress' ? 'w-2/3' : 'w-1/4'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Edits Section */}
          <section id="edits" className="py-24 px-6 bg-cardBg/50 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
              <SectionTitle title="Edits" subtitle="Click to view the magic" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {edits.map(edit => (
                  <div key={edit.id} onClick={() => edit.videoUrl !== '#' && window.open(edit.videoUrl, '_blank')} className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer">
                    <img src={edit.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={edit.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h4 className="text-xl font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-transform">{edit.title}</h4>
                      <div className="flex items-center gap-2 text-neonGreen text-sm opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest">
                        Watch Now <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 px-6 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
              <SectionTitle title="Contact Me" />
              <div className="bg-cardBg border border-neonGreen/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                {formStatus === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-neonGreen mx-auto mb-6" />
                    <h3 className="text-3xl font-bold">Message Sent!</h3>
                    <p className="text-gray-400">Transmitted to the command center.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input required type="text" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neonGreen" placeholder="Name" />
                      <input required type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neonGreen" placeholder="Email" />
                    </div>
                    <textarea required rows={5} value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-neonGreen resize-none" placeholder="Message"></textarea>
                    <button type="submit" className="w-full py-4 bg-neonGreen text-black font-black uppercase rounded-xl hover:opacity-90">Send Transmission</button>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Socials Section */}
          <section id="socials" className="py-24 px-6 bg-neonGreen text-black scroll-mt-20">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl md:text-6xl font-black uppercase mb-12">Follow Me</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {SOCIAL_LINKS.map(social => (
                  <a key={social.name} href={social.url} onClick={(e) => social.url === '#' && e.preventDefault()} className="flex flex-col items-center gap-4 group">
                    <div className="w-20 h-20 rounded-full bg-black text-neonGreen flex items-center justify-center transition-transform group-hover:scale-125 group-hover:-rotate-12">{social.icon}</div>
                    <span className="font-black uppercase tracking-widest text-sm">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* Admin Interface */
        <div className="pt-24 px-6 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12 bg-cardBg p-6 rounded-2xl border border-neonGreen/20">
              <h1 className="text-2xl font-black uppercase">Command Center</h1>
              <button onClick={() => setIsAdminMode(false)} className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-xl font-bold">Exit</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Edit About */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2"><User className="text-neonGreen" /> Bio</h3>
                <textarea 
                  value={about.bio}
                  onChange={e => { const updated = {...about, bio: e.target.value}; setAbout(updated); updateAboutDb(updated); }}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 outline-none focus:border-neonGreen mb-4"
                  rows={4}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input value={about.age} onChange={e => { const updated = {...about, age: e.target.value}; setAbout(updated); updateAboutDb(updated); }} className="bg-black/50 border border-white/10 rounded-xl p-3" placeholder="Age" />
                  <input value={about.orientation} onChange={e => { const updated = {...about, orientation: e.target.value}; setAbout(updated); updateAboutDb(updated); }} className="bg-black/50 border border-white/10 rounded-xl p-3" placeholder="Orientation" />
                </div>
              </div>

              {/* Manage Projects */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black uppercase">Projects</h3>
                  <button onClick={addProject} className="p-2 bg-neonGreen text-black rounded-lg"><Plus /></button>
                </div>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {projects.map(p => (
                    <div key={p.id} className="bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="flex-1 mr-4">
                        <input className="bg-transparent font-bold w-full outline-none focus:text-neonGreen" value={p.name} onChange={e => updateProject(p.id, { name: e.target.value })} />
                      </div>
                      <button onClick={() => deleteProject(p.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inbox */}
              <div className="bg-cardBg p-8 rounded-3xl border border-white/5 lg:col-span-2">
                <h3 className="text-xl font-black uppercase mb-6">Inbound Messages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className="bg-black/40 p-4 rounded-xl border border-white/5 relative group">
                      <button onClick={() => deleteMessage(msg.id)} className="absolute top-4 right-4 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      <div className="font-bold text-neonGreen">{msg.name}</div>
                      <div className="text-xs text-gray-500 mb-2">{msg.email} • {new Date(msg.date).toLocaleString()}</div>
                      <p className="text-sm text-gray-300 italic">"{msg.message}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-cardBg border border-neonGreen/30 rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
            <h2 className="text-3xl font-black uppercase mb-6 neon-text">Restricted</h2>
            <form onSubmit={handleAdminLogin} className="space-y-6">
              <input autoFocus type="password" placeholder="Terminal Password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-neonGreen text-center tracking-widest" />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 bg-white/10 rounded-xl font-bold uppercase">Back</button>
                <button type="submit" className="flex-1 py-4 bg-neonGreen text-black rounded-xl font-bold uppercase">Enter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="py-20 px-6 border-t border-white/5 bg-black text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <span className="text-2xl font-black uppercase">Luhv<span className="text-neonGreen">Reuben</span></span>
          <div className="text-gray-500 text-sm">&copy; 2026 LuhvReuben &bull; Always Evolving 🚀</div>
        </div>
      </footer>
    </div>
  );
}
