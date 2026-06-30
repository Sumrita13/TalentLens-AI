import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Trophy, BarChart3, LogOut, User as UserIcon, FileText, Users, Activity } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['candidate', 'recruiter'] },
    { name: 'JD Builder', path: '/jd-management', icon: FileText, roles: ['recruiter'] },
    { name: 'Candidates', path: '/candidates', icon: Users, roles: ['recruiter'] },
    { name: 'AI Rank', path: '/rankings', icon: Trophy, roles: ['recruiter'] },
    { name: 'Compare', path: '/compare', icon: Activity, roles: ['recruiter'] },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['recruiter'] },
    { name: 'Settings', path: '/settings', icon: UserIcon, roles: ['recruiter'] }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#0a0815]/95 backdrop-blur-2xl navbar-separator sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-10">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-pink-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                <BarChart3 className="text-white w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tighter text-white leading-none">
                TalentLens <span className="text-pink-500">AI</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-300/40 mt-1"></span>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              {navItems
                .filter(item => !user || item.roles.includes(user.role))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${isActive
                          ? 'nav-link-active text-white'
                          : 'text-purple-300/30 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-pink-500' : ''}`} />
                      {item.name}
                    </Link>
                  );
                })}
            </div>

            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-white/5">
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-widest">{user.name}</p>
                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest">{user.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <UserIcon className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 hover:bg-rose-500/10 rounded-xl group transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-purple-300/30 group-hover:text-rose-400 transition-colors" />
                </button>
              </div>
            ) : (
              <div className="pl-6 border-l border-white/5">
                <Link to="/login" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
