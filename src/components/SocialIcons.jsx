import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const SocialIcons = () => {
  const socials = [
    { id: 1, icon: FaTwitter, url: 'https://twitter.com' },
    { id: 2, icon: FaGithub, url: 'https://github.com' },
    { id: 3, icon: FaLinkedin, url: 'https://linkedin.com' },
    { id: 4, icon: FaEnvelope, url: 'mailto:hello@example.com' },
  ];

  return (
    <div className="flex items-center justify-center gap-5 sm:gap-8 pb-10 pt-2">
      {socials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-12 h-12 rounded-2xl glass-panel glass-panel-hover text-zinc-400 hover:text-zinc-50"
          >
            <Icon size={20} className="relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-2xl transition-colors duration-300"></div>
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
