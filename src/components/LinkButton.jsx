
const LinkButton = ({ title, url, icon: Icon }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-between w-full p-4 mb-4 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:text-purple-400 group-hover:bg-slate-900 transition-colors duration-300">
            <Icon size={20} />
          </div>
        )}
        <span className="font-medium text-slate-200 group-hover:text-white transition-colors duration-300">
          {title}
        </span>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 group-hover:text-purple-400 group-hover:bg-slate-800 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </div>
    </a>
  );
};

export default LinkButton;
