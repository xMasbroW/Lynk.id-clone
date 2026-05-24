import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const SocialIcons = () => {
  const socials = [
    { id: 1, icon: FaTwitter, url: 'https://twitter.com' },
    { id: 2, icon: FaGithub, url: 'https://github.com' },
    { id: 3, icon: FaLinkedin, url: 'https://linkedin.com' },
    { id: 4, icon: FaEnvelope, url: 'mailto:hello@example.com' },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {socials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-[20px] glass-panel glass-panel-hover text-zinc-500 hover:text-white"
          >
            <Icon size={20} className="relative z-10 transform transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-[20px] transition-colors duration-500"></div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
