import { FaEnvelope, FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

const SocialIcons = () => {
  const socials = [
    { id: 1, icon: FaTwitter, url: 'https://twitter.com' },
    { id: 2, icon: FaGithub, url: 'https://github.com' },
    { id: 3, icon: FaLinkedin, url: 'https://linkedin.com' },
    { id: 4, icon: FaEnvelope, url: 'mailto:hello@example.com' },
  ];

  return (
    <div className="flex items-center justify-center gap-6 py-8">
      {socials.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transform hover:scale-110 transition-all duration-300"
          >
            <Icon size={24} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
