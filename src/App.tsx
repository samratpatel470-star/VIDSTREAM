import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Video as VideoIcon, 
  Bell, 
  User, 
  Home as HomeIcon, 
  Compass, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  MoreVertical,
  Mic,
  Library,
  History,
  Flame,
  Music2,
  Gamepad2,
  Trophy,
  Settings,
  Flag,
  HelpCircle,
  MessageSquare,
  Share2,
  Download,
  Scissors,
  Plus,
  Check,
  X,
  Copy,
  Trash2,
  ListPlus,
  Play,
  RotateCcw,
  Volume2,
  Maximize,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Repeat
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_VIDEOS, MOCK_SHORTS, CATEGORIES, Video, Short } from './data/mockVideos';
import { cn } from './lib/utils';

// --- Context & State ---

interface AppState {
  likedVideos: string[];
  dislikedVideos: string[];
  subscribedChannels: string[];
  watchLater: string[];
  history: string[];
  currentPlayingVideo: Video | null;
  setCurrentPlayingVideo: (video: Video | null) => void;
  toggleLike: (id: string) => void;
  toggleDislike: (id: string) => void;
  toggleSubscribe: (channel: string) => void;
  toggleWatchLater: (id: string) => void;
  addToHistory: (id: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [dislikedVideos, setDislikedVideos] = useState<string[]>([]);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);
  const [watchLater, setWatchLater] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>(null);

  const toggleLike = (id: string) => {
    setLikedVideos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    setDislikedVideos(prev => prev.filter(i => i !== id));
  };

  const toggleDislike = (id: string) => {
    setDislikedVideos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    setLikedVideos(prev => prev.filter(i => i !== id));
  };

  const toggleSubscribe = (channel: string) => {
    setSubscribedChannels(prev => prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]);
  };

  const toggleWatchLater = (id: string) => {
    setWatchLater(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const addToHistory = (id: string) => {
    setHistory(prev => [id, ...prev.filter(i => i !== id)].slice(0, 50));
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(i => i !== id));
  };

  const clearHistory = () => setHistory([]);

  return (
    <AppContext.Provider value={{
      likedVideos, dislikedVideos, subscribedChannels, watchLater, history,
      currentPlayingVideo, setCurrentPlayingVideo,
      toggleLike, toggleDislike, toggleSubscribe, toggleWatchLater, addToHistory, removeFromHistory, clearHistory
    }}>
      {children}
    </AppContext.Provider>
  );
}

// --- Components ---

function VoiceSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-10 flex flex-col items-center gap-8 w-full max-w-lg shadow-2xl"
      >
        <div className="flex justify-between w-full items-center">
          <h3 className="text-2xl font-bold">Listening...</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="relative">
          <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <Mic className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -inset-4 border-4 border-red-600/30 rounded-full animate-ping" />
        </div>
        <p className="text-gray-500 text-center text-lg">Say something like "Swiss Alps travel guide"</p>
      </motion.div>
    </div>
  );
}

function MiniPlayer() {
  const { currentPlayingVideo, setCurrentPlayingVideo } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  if (!currentPlayingVideo || location.pathname.startsWith('/watch/')) return null;

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-4 right-4 w-80 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-zinc-800"
    >
      <div className="relative aspect-video group">
        <video src={currentPlayingVideo.videoUrl} autoPlay muted className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button onClick={() => navigate(`/watch/${currentPlayingVideo.id}`)} className="p-2 bg-white/20 rounded-full backdrop-blur-md"><Maximize className="w-5 h-5" /></button>
          <button onClick={() => setCurrentPlayingVideo(null)} className="p-2 bg-white/20 rounded-full backdrop-blur-md"><X className="w-5 h-5" /></button>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="overflow-hidden">
          <h4 className="text-sm font-bold truncate">{currentPlayingVideo.title}</h4>
          <p className="text-xs text-gray-500 truncate">{currentPlayingVideo.channelName}</p>
        </div>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"><Play className="w-5 h-5 fill-current" /></button>
      </div>
    </motion.div>
  );
}

function ShareModal({ isOpen, onClose, videoTitle }: { isOpen: boolean; onClose: () => void; videoTitle: string }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Share</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
          {['WhatsApp', 'Facebook', 'Twitter', 'Email', 'Reddit', 'LinkedIn'].map(platform => (
            <div key={platform} className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer transition-colors">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium">{platform}</span>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 dark:bg-zinc-800 p-3 rounded-xl flex items-center justify-between gap-4 border border-gray-200 dark:border-zinc-700">
          <span className="text-sm truncate text-gray-500">{url}</span>
          <button 
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-colors shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [query, setQuery] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setQuery(q);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass-dark flex items-center justify-between px-6 z-50 border-b border-white/5">
      <VoiceSearchModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-cyan-400" />
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-1.5 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all duration-500">
            <VideoIcon className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="font-black text-2xl tracking-tighter hidden sm:block bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent neon-text-cyan">VidStream</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-[720px] flex items-center gap-4 px-4">
        <div className="flex flex-1 items-center">
          <div className="flex flex-1 items-center bg-white/5 border border-white/10 rounded-l-2xl px-4 py-2 focus-within:border-cyan-500/50 focus-within:bg-white/10 transition-all duration-300">
            <Search className="w-5 h-5 text-cyan-400/50 mr-2 hidden sm:block" />
            <input
              type="text"
              placeholder="Explore the future..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-gray-600 text-white font-medium"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="bg-white/10 border border-l-0 border-white/10 rounded-r-2xl px-6 py-2 hover:bg-cyan-500/20 transition-all group shadow-sm">
            <Search className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        <button 
          type="button" 
          onClick={() => setIsVoiceModalOpen(true)}
          className="p-2.5 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all hover:scale-110 hidden md:block"
        >
          <Mic className="w-5 h-5 text-cyan-400" />
        </button>
      </form>

      <div className="flex items-center gap-1 sm:gap-2">
        <div className="hidden sm:flex items-center gap-2">
          <div className="relative group/create">
            <button className="p-2.5 hover:bg-white/10 rounded-2xl transition-all hover:scale-110">
              <Plus className="w-6 h-6 text-cyan-400" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 glass-dark rounded-2xl shadow-2xl border border-white/10 hidden group-hover/create:block z-50 py-2 overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors">
                <Play className="w-4 h-4 text-cyan-400" /> Upload video
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-sm font-medium transition-colors">
                <VideoIcon className="w-4 h-4 text-magenta-400" /> Go live
              </button>
            </div>
          </div>

          <div className="relative group/notif">
            <button className="p-2.5 hover:bg-white/10 rounded-2xl transition-all hover:scale-110 relative">
              <Bell className="w-6 h-6 text-cyan-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)]" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-80 glass-dark rounded-2xl shadow-2xl border border-white/10 hidden group-hover/notif:block z-50 overflow-hidden">
              <div className="p-4 border-b border-white/10 font-bold text-sm">Notifications</div>
              <div className="max-h-96 overflow-y-auto no-scrollbar">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 hover:bg-white/5 flex gap-3 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex-shrink-0 border border-white/10" />
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-medium line-clamp-2 leading-relaxed">Future Tech uploaded: "Quantum Computing Explained in 5 Minutes"</p>
                      <span className="text-[10px] text-cyan-400/50">2 hours ago</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative group/profile">
          <button className="p-1 rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-500 transition-all hover:scale-105">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-inner">
              SP
            </div>
          </button>
          <div className="absolute right-0 top-full mt-2 w-64 glass-dark rounded-2xl shadow-2xl border border-white/10 hidden group-hover/profile:block z-50 py-2 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-black">SP</div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Samrat Patel</span>
                <span className="text-xs text-cyan-400/50">@samrat_futurist</span>
              </div>
            </div>
            <div className="py-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 text-sm font-medium transition-colors">
                <User className="w-4 h-4 text-cyan-400" /> Your channel
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm">
                <Settings className="w-4 h-4" /> YouTube Studio
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm">
                <User className="w-4 h-4" /> Switch account
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm border-t border-gray-100 dark:border-zinc-800 mt-2 pt-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm">
                <HelpCircle className="w-4 h-4" /> Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const menuItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Repeat, label: 'Shorts', path: '/shorts' },
    { icon: PlaySquare, label: 'Subscriptions', path: '/subscriptions' },
    { separator: true },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: History, label: 'History', path: '/history' },
    { icon: PlaySquare, label: 'Your videos', path: '/your-videos' },
    { icon: Clock, label: 'Watch later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked videos', path: '/liked' },
    { separator: true, label: 'Explore' },
    { icon: Flame, label: 'Trending', path: '/trending' },
    { icon: Music2, label: 'Music', path: '/music' },
    { icon: Gamepad2, label: 'Gaming', path: '/gaming' },
    { icon: Trophy, label: 'Sports', path: '/sports' },
    { separator: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Flag, label: 'Report history', path: '/report' },
    { icon: HelpCircle, label: 'Help', path: '/help' },
    { icon: MessageSquare, label: 'Send feedback', path: '/feedback' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-16 bottom-0 glass-dark overflow-y-auto transition-all duration-500 z-40 no-scrollbar border-r border-white/5",
        isOpen ? "w-64 px-4" : "w-0 sm:w-24 px-2 overflow-hidden"
      )}
    >
      <div className="py-6 space-y-1">
        {menuItems.map((item, index) => (
          item.separator ? (
            <div key={index} className="my-6 border-t border-white/5 pt-6 px-4">
              {item.label && <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/40 px-1">{item.label}</span>}
            </div>
          ) : (
            <Link
              key={index}
              to={item.path || '/'}
              className={cn(
                "flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                !isOpen && "flex-col gap-1 justify-center px-0 py-4",
                location.pathname === item.path 
                  ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,1)]"
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110", 
                location.pathname === item.path ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" : "group-hover:text-cyan-400"
              )} />
              <span className={cn(
                "text-sm transition-all duration-300", 
                !isOpen ? "text-[10px]" : "font-semibold tracking-tight",
                location.pathname === item.path ? "text-cyan-400" : "group-hover:translate-x-1"
              )}>
                {item.label}
              </span>
            </Link>
          )
        ))}
      </div>
    </aside>
  );
}

function VideoCard({ video }: { video: Video; key?: string }) {
  const { watchLater, toggleWatchLater, setCurrentPlayingVideo } = useApp();
  const isWatchLater = watchLater.includes(video.id);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="group relative"
    >
      <div className="flex flex-col gap-4 relative glass-dark p-3 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/10">
        <Link 
          to={`/watch/${video.id}`} 
          onClick={() => setCurrentPlayingVideo(video)}
          className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-black/40 border border-white/5 group-hover:border-cyan-500/50 transition-all duration-700"
        >
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
          
          <div className="absolute bottom-3 right-3 glass px-2.5 py-1 rounded-xl text-[10px] font-black tracking-widest text-white border border-white/10 shadow-2xl">
            {video.duration}
          </div>
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button 
              onClick={(e) => {
                e.preventDefault();
                toggleWatchLater(video.id);
              }}
              className={cn(
                "p-2.5 rounded-2xl glass-dark opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-white/10",
                isWatchLater && "opacity-100 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] border-cyan-500/30"
              )}
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>
        </Link>

        <div className="flex gap-4 px-2 pb-1">
          <Link to={`/channel/${video.channelName}`} className="flex-shrink-0 mt-1 relative group/avatar">
            <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur-md opacity-0 group-hover/avatar:opacity-40 transition-opacity duration-500" />
            <img 
              src={video.channelAvatar} 
              alt={video.channelName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-cyan-500/50 transition-all duration-500 relative z-10"
              referrerPolicy="no-referrer"
            />
          </Link>
          <div className="flex flex-col overflow-hidden flex-1">
            <Link to={`/watch/${video.id}`} onClick={() => setCurrentPlayingVideo(video)}>
              <h3 className="font-black text-sm line-clamp-2 leading-relaxed group-hover:text-cyan-400 transition-colors tracking-tight">
                {video.title}
              </h3>
            </Link>
            <div className="text-[11px] text-gray-500 mt-2 flex flex-col gap-1.5">
              <Link to={`/channel/${video.channelName}`} className="hover:text-cyan-400 transition-colors font-bold flex items-center gap-2 group/channel">
                <span className="truncate">{video.channelName}</span>
                <Check className="w-3.5 h-3.5 bg-cyan-500 text-white rounded-full p-0.5 shadow-[0_0_8px_rgba(6,182,212,0.6)] group-hover/channel:scale-110 transition-transform" />
              </Link>
              <div className="flex items-center gap-2 font-black text-[10px] tracking-widest text-white/30 uppercase">
                <span>{video.views}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>{video.postedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// --- Pages ---

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const { setCurrentPlayingVideo } = useApp();
  
  const filteredVideos = MOCK_VIDEOS.filter(video => 
    video.title.toLowerCase().includes(query.toLowerCase()) ||
    video.channelName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 px-4">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <button className="flex items-center gap-2 px-4 py-2 glass-dark hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-cyan-400 border border-white/5 transition-all">
          <Flame className="w-5 h-5" /> Filters
        </button>
      </div>

      {filteredVideos.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filteredVideos.map(video => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 10 }}
              className="flex flex-col md:flex-row gap-6 group cursor-pointer glass-dark p-4 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500"
            >
              <Link 
                to={`/watch/${video.id}`} 
                onClick={() => setCurrentPlayingVideo(video)}
                className="relative w-full md:w-[400px] aspect-video rounded-[1.5rem] overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-cyan-500/50 transition-all duration-500"
              >
                <img src={video.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <span className="absolute bottom-3 right-3 glass px-2.5 py-1 rounded-xl text-[10px] font-black tracking-widest text-white border border-white/10">{video.duration}</span>
              </Link>
              <div className="flex flex-col gap-3 py-2 flex-1">
                <Link to={`/watch/${video.id}`} onClick={() => setCurrentPlayingVideo(video)}>
                  <h3 className="text-xl font-black line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors tracking-tight">{video.title}</h3>
                </Link>
                <div className="text-[10px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                  <span>{video.views}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span>{video.postedAt}</span>
                </div>
                <Link to={`/channel/${video.channelName}`} className="flex items-center gap-3 my-2 group/channel">
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-0 group-hover/channel:opacity-40 transition-opacity" />
                    <img src={video.channelAvatar} className="w-8 h-8 rounded-xl relative z-10 border border-white/10" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 group-hover:text-cyan-400 transition-colors">{video.channelName}</span>
                  <Check className="w-3.5 h-3.5 bg-cyan-500 text-white rounded-full p-0.5 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                </Link>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">This is a detailed description of the video content for {video.title}. Subscribe for more amazing content like this!</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-black glass px-2 py-1 rounded-lg border border-white/5 text-cyan-400/70">4K</span>
                  <span className="text-[10px] font-black glass px-2 py-1 rounded-lg border border-white/5 text-magenta-400/70">HDR</span>
                  <span className="text-[10px] font-black glass px-2 py-1 rounded-lg border border-white/5 text-blue-400/70">CC</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <Search className="w-24 h-24 text-cyan-400/20 relative z-10" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter neon-text-cyan">No results found</h2>
          <p className="text-gray-500 font-medium">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
}

function HomePage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const searchQuery = searchParams.get('search') || '';

  if (searchQuery) return <SearchResultsPage />;

  const filteredVideos = MOCK_VIDEOS.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Categories */}
      <div className="sticky top-16 z-30 glass-dark py-4 -mx-4 px-4 border-b border-white/5 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 max-w-max mx-auto md:mx-0">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                selectedCategory === category 
                  ? "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]" 
                  : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
        {filteredVideos.slice(0, 8).map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Shorts Section */}
      <div className="my-12 border-t border-white/5 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-magenta-500/20 rounded-xl border border-magenta-500/30">
              <Repeat className="w-6 h-6 text-magenta-400" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-magenta-400 to-pink-500 bg-clip-text text-transparent uppercase">Shorts</h2>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-magenta-400 hover:text-magenta-300 transition-colors">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {MOCK_SHORTS.map((short, index) => (
            <motion.div 
              key={short.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="relative aspect-[9/16] rounded-[2rem] overflow-hidden group border border-white/5 hover:border-magenta-500/50 transition-all duration-500 shadow-2xl"
            >
              <img src={short.thumbnail} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <p className="text-xs font-bold line-clamp-2 leading-tight text-white group-hover:text-magenta-400 transition-colors">{short.title}</p>
                <p className="text-[10px] font-black tracking-widest text-white/50 uppercase">{short.views} views</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10 mt-8">
        {filteredVideos.slice(8).map(video => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <Search className="w-24 h-24 text-cyan-400/20 relative z-10" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter neon-text-cyan uppercase">No content found</h2>
          <p className="text-gray-500 font-medium">Try selecting a different category</p>
          <button 
            onClick={() => setSelectedCategory('All')}
            className="mt-4 px-8 py-3 bg-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}

function WatchView() {
  const { id } = useParams();
  const { 
    likedVideos, dislikedVideos, subscribedChannels, toggleLike, toggleDislike, toggleSubscribe, addToHistory, setCurrentPlayingVideo 
  } = useApp();
  const video = MOCK_VIDEOS.find(v => v.id === id);
  const relatedVideos = MOCK_VIDEOS.filter(v => v.id !== id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [comments, setComments] = useState<{ id: number; text: string; user: string; time: string }[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (id && video) {
      window.scrollTo(0, 0);
      addToHistory(id);
      setCurrentPlayingVideo(video);
    }
  }, [id, video]);

  const isLiked = video ? likedVideos.includes(video.id) : false;
  const isDisliked = video ? dislikedVideos.includes(video.id) : false;
  const isSubscribed = video ? subscribedChannels.includes(video.channelName) : false;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [{
      id: Date.now(),
      text: newComment,
      user: 'Samrat Patel',
      time: 'Just now'
    }, ...prev]);
    setNewComment('');
  };

  if (!video) return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold mb-4">Video not found</h2>
      <Link to="/" className="text-blue-500 hover:underline">Back to Home</Link>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-8 max-w-[1800px] mx-auto pb-12">
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} videoTitle={video.title} />
      
      <div className="flex-1 flex flex-col gap-6">
        <div className="aspect-video rounded-[2.5rem] overflow-hidden glass-dark border border-white/10 shadow-2xl relative group">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <video 
            src={video.videoUrl} 
            controls 
            autoPlay
            className="w-full h-full"
          />
        </div>
        
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 glass-dark p-6 rounded-[2rem] border border-white/5">
            <div className="flex items-center gap-4">
              <Link to={`/channel/${video.channelName}`} className="relative group">
                <div className="absolute inset-0 bg-cyan-500 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={video.channelAvatar} 
                  alt={video.channelName}
                  className="w-12 h-12 rounded-2xl relative z-10 border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="flex flex-col">
                <Link to={`/channel/${video.channelName}`} className="flex items-center gap-1 group">
                  <span className="font-black text-lg group-hover:text-cyan-400 transition-colors">{video.channelName}</span>
                  <Check className="w-4 h-4 bg-cyan-500 text-white rounded-full p-0.5 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                </Link>
                <span className="text-xs font-black tracking-widest text-white/30 uppercase">1.24M subscribers</span>
              </div>
              <button 
                onClick={() => toggleSubscribe(video.channelName)}
                className={cn(
                  "ml-4 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border",
                  isSubscribed 
                    ? "bg-white/5 text-white border-white/10 hover:bg-white/10" 
                    : "bg-white text-black border-white hover:bg-cyan-400 hover:text-white hover:border-cyan-400 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                )}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
              <div className="flex items-center glass rounded-2xl p-1 border border-white/5">
                <button 
                  onClick={() => toggleLike(video.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 border-r border-white/10",
                    isLiked ? "bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "hover:bg-white/10 text-white/70"
                  )}
                >
                  <ThumbsUp className={cn("w-5 h-5", isLiked && "fill-current")} />
                  <span className="text-xs font-black uppercase tracking-widest">124K</span>
                </button>
                <button 
                  onClick={() => toggleDislike(video.id)}
                  className={cn(
                    "flex items-center px-5 py-2.5 rounded-xl transition-all duration-300",
                    isDisliked ? "bg-magenta-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]" : "hover:bg-white/10 text-white/70"
                  )}
                >
                  <ThumbsDown className={cn("w-5 h-5", isDisliked && "fill-current")} />
                </button>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-5 py-3 glass hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/70 border border-white/5 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 glass hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white/70 border border-white/5 transition-all hidden md:flex">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button className="p-3 glass hover:bg-white/10 rounded-2xl text-white/70 border border-white/5 transition-all">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            className={cn(
              "glass-dark p-6 rounded-[2rem] border border-white/5 transition-all duration-500 cursor-pointer hover:border-white/10",
              isExpanded ? "h-auto" : "max-h-32 overflow-hidden"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center gap-3 text-xs font-black tracking-widest uppercase mb-3">
              <span className="text-white">{video.views}</span>
              <span className="text-white">{video.postedAt}</span>
              <div className="flex gap-2">
                <span className="text-cyan-400/70">#futuristic</span>
                <span className="text-magenta-400/70">#nextgen</span>
                <span className="text-blue-400/70">#tech</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed text-gray-400 font-medium">
              {video.description}
              {"\n\n"}
              Experience the future of video streaming with this incredible content. 
              Don't forget to like, subscribe, and hit the notification bell for more updates!
            </p>
            {!isExpanded && <button className="text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors mt-3">...more</button>}
            {isExpanded && <button className="text-xs font-black uppercase tracking-widest text-white hover:text-cyan-400 transition-colors mt-4 block">Show less</button>}
          </div>

          {/* Comments Section */}
          <div className="mt-12 flex flex-col gap-10">
            <div className="flex items-center gap-8">
              <h3 className="text-2xl font-black tracking-tighter uppercase">{1420 + comments.length} Comments</h3>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                <Menu className="w-5 h-5" /> Sort by
              </button>
            </div>
            
            <div className="flex gap-4">
              <img src="https://picsum.photos/seed/user/40/40" className="w-12 h-12 rounded-2xl border border-white/10" referrerPolicy="no-referrer" />
              <div className="flex-1 flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="w-full bg-transparent border-b border-white/10 py-2 focus:border-cyan-500 outline-none transition-all text-sm font-medium"
                />
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setNewComment('')}
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white/50 hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-8 py-2.5 bg-cyan-500 disabled:bg-white/5 disabled:text-white/20 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8 mt-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4 group">
                  <img src={`https://picsum.photos/seed/${comment.user}/40/40`} className="w-12 h-12 rounded-2xl border border-white/10" referrerPolicy="no-referrer" />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-white">{comment.user}</span>
                      <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{comment.text}</p>
                    <div className="flex items-center gap-6 mt-1">
                      <div className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">24</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 hover:text-magenta-400 transition-colors cursor-pointer">
                        <ThumbsDown className="w-4 h-4" />
                      </div>
                      <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              {/* Mock Comments */}
              <div className="flex gap-4 group">
                <img src="https://picsum.photos/seed/alex/40/40" className="w-12 h-12 rounded-2xl border border-white/10" referrerPolicy="no-referrer" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white">Alex Rivera</span>
                    <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">2 hours ago</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">This futuristic design is absolutely mind-blowing! The glassmorphism effects are so smooth. Great job on the UI!</p>
                  <div className="flex items-center gap-6 mt-1">
                    <div className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors cursor-pointer">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">1.2K</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40 hover:text-magenta-400 transition-colors cursor-pointer">
                      <ThumbsDown className="w-4 h-4" />
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full xl:w-[420px] flex flex-col gap-6">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
          {['All', 'From this channel', 'Related', 'Recently uploaded'].map(tab => (
            <button key={tab} className="px-4 py-2 glass-dark border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-white/10 hover:border-cyan-500/30 transition-all">
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col gap-4">
          {relatedVideos.map(v => (
            <Link key={v.id} to={`/watch/${v.id}`} className="flex gap-3 group">
              <div className="relative w-40 sm:w-48 aspect-video rounded-2xl overflow-hidden flex-shrink-0 bg-zinc-900 border border-white/5 group-hover:border-cyan-500/30 transition-all">
                <img 
                  src={v.thumbnail} 
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-black tracking-tighter border border-white/10">
                  {v.duration}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 py-1">
                <h4 className="text-sm font-black leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">{v.title}</h4>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-black tracking-wide text-white/40 uppercase group-hover:text-white/60 transition-colors">{v.channelName}</p>
                  <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">{v.views} • {v.postedAt}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListView({ title, videos, emptyMessage, onClear }: { title: string; videos: Video[]; emptyMessage: string; onClear?: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black">{title}</h2>
        {onClear && videos.length > 0 && (
          <button onClick={onClear} className="text-blue-500 font-bold hover:underline flex items-center gap-2">
            <Trash2 className="w-5 h-5" /> Clear all
          </button>
        )}
      </div>
      
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-gray-500">
          <PlaySquare className="w-20 h-20 mb-6 opacity-10" />
          <p className="text-xl font-bold text-gray-400 dark:text-zinc-600">{emptyMessage}</p>
          <Link to="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg">
            Explore videos
          </Link>
        </div>
      )}
    </div>
  );
}

function SubscriptionsPage() {
  const { subscribedChannels } = useApp();
  const videos = MOCK_VIDEOS.filter(v => subscribedChannels.includes(v.channelName));
  return <ListView title="Subscriptions" videos={videos} emptyMessage="You haven't subscribed to any channels yet" />;
}

function LikedPage() {
  const { likedVideos } = useApp();
  const videos = MOCK_VIDEOS.filter(v => likedVideos.includes(v.id));
  return <ListView title="Liked Videos" videos={videos} emptyMessage="You haven't liked any videos yet" />;
}

function WatchLaterPage() {
  const { watchLater } = useApp();
  const videos = MOCK_VIDEOS.filter(v => watchLater.includes(v.id));
  return <ListView title="Watch Later" videos={videos} emptyMessage="Your Watch Later list is empty" />;
}

function HistoryPage() {
  const { history, clearHistory } = useApp();
  const videos = history.map(id => MOCK_VIDEOS.find(v => v.id === id)).filter(Boolean) as Video[];
  return <ListView title="History" videos={videos} emptyMessage="Your watch history is empty" onClear={clearHistory} />;
}

function TrendingPage() {
  const videos = [...MOCK_VIDEOS].sort((a, b) => parseFloat(b.views) - parseFloat(a.views));
  return <ListView title="Trending" videos={videos} emptyMessage="No trending videos at the moment" />;
}

function ShortsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toggleLike, likedVideos, toggleSubscribe, subscribedChannels } = useApp();

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % MOCK_SHORTS.length);
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + MOCK_SHORTS.length) % MOCK_SHORTS.length);

  const short = MOCK_SHORTS[currentIndex];
  const isLiked = likedVideos.includes(short.id);
  const isSubscribed = subscribedChannels.includes(short.channelName);

  return (
    <div className="flex items-center justify-center h-[calc(100vh-100px)] relative">
      <div className="flex gap-8 items-end">
        <motion.div 
          key={short.id}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative w-[400px] h-[700px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-zinc-800"
        >
          <video src={short.videoUrl} autoPlay loop className="w-full h-full object-cover" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 gap-4">
            <div className="flex items-center gap-3">
              <img src={short.channelAvatar} className="w-10 h-10 rounded-full border-2 border-white" />
              <span className="font-bold text-white">@{short.channelName.toLowerCase()}</span>
              <button 
                onClick={() => toggleSubscribe(short.channelName)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  isSubscribed ? "bg-white/20 text-white" : "bg-red-600 text-white"
                )}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            <h3 className="text-white font-medium text-lg leading-snug">{short.title}</h3>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Music2 className="w-4 h-4" />
              <span>Original Audio - {short.channelName}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-6 pb-10">
          <div className="flex flex-col items-center gap-1">
            <button onClick={() => toggleLike(short.id)} className={cn("p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors", isLiked && "text-blue-500")}>
              <ThumbsUp className={cn("w-7 h-7", isLiked && "fill-current")} />
            </button>
            <span className="text-xs font-bold">{short.likes}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
              <ThumbsUp className="w-7 h-7 rotate-180" />
            </button>
            <span className="text-xs font-bold">Dislike</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
              <MessageCircle className="w-7 h-7" />
            </button>
            <span className="text-xs font-bold">{short.comments}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
              <Share2 className="w-7 h-7" />
            </button>
            <span className="text-xs font-bold">Share</span>
          </div>
          <button className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
            <MoreVertical className="w-7 h-7" />
          </button>
        </div>
      </div>

      <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button onClick={handlePrev} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors shadow-xl">
          <ChevronUp className="w-8 h-8" />
        </button>
        <button onClick={handleNext} className="p-3 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors shadow-xl">
          <ChevronDown className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

function ChannelPage() {
  const { name } = useParams();
  const { subscribedChannels, toggleSubscribe } = useApp();
  const isSubscribed = subscribedChannels.includes(name || '');
  const channelVideos = MOCK_VIDEOS.filter(v => v.channelName === name);

  return (
    <div className="flex flex-col gap-8">
      <div className="h-48 sm:h-64 bg-zinc-800 rounded-3xl overflow-hidden relative">
        <img src={`https://picsum.photos/seed/${name}/1920/400`} className="w-full h-full object-cover opacity-60" />
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-6 px-4">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-zinc-900 -mt-16 sm:-mt-20 z-10" />
        <div className="flex flex-col items-center sm:items-start gap-2">
          <h1 className="text-3xl font-black">{name}</h1>
          <div className="text-gray-500 text-sm font-medium">@{(name || '').toLowerCase().replace(' ', '')} • 1.24M subscribers • 142 videos</div>
          <p className="text-sm text-gray-500 max-w-2xl text-center sm:text-left">Welcome to the official channel of {name}. Subscribe for the best content on the platform!</p>
          <div className="flex gap-3 mt-2">
            <button 
              onClick={() => toggleSubscribe(name || '')}
              className={cn(
                "px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg",
                isSubscribed ? "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white" : "bg-black dark:bg-white text-white dark:text-black"
              )}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
            <button className="px-6 py-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full font-bold text-sm">Join</button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-zinc-800 flex gap-8 px-4 overflow-x-auto no-scrollbar">
        {['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Community', 'About'].map(tab => (
          <button key={tab} className={cn("pb-3 text-sm font-bold border-b-2 transition-colors", tab === 'Videos' ? "border-black dark:border-white" : "border-transparent text-gray-500")}>
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 px-4">
        {channelVideos.map(video => <VideoCard key={video.id} video={video} />)}
      </div>
    </div>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-black dark:text-white font-sans selection:bg-red-500/30 transition-colors duration-300">
          <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <Sidebar isOpen={isSidebarOpen} />

          <main 
            className={cn(
              "pt-14 transition-all duration-300 min-h-screen",
              isSidebarOpen ? "pl-0 lg:pl-60" : "pl-0 sm:pl-20"
            )}
          >
            <div className="p-4 sm:p-6 lg:p-8 max-w-[2400px] mx-auto">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/watch/:id" element={<WatchView />} />
                  <Route path="/shorts" element={<ShortsPage />} />
                  <Route path="/channel/:name" element={<ChannelPage />} />
                  <Route path="/subscriptions" element={<SubscriptionsPage />} />
                  <Route path="/liked" element={<LikedPage />} />
                  <Route path="/watch-later" element={<WatchLaterPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/trending" element={<TrendingPage />} />
                  <Route path="/explore" element={<TrendingPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </AnimatePresence>
            </div>
          </main>
          <MiniPlayer />
        </div>
      </Router>
    </AppProvider>
  );
}
