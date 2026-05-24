import { FaYoutube, FaTiktok, FaInstagram, FaWhatsapp, FaGlobe, FaTwitter, FaGithub, FaLinkedin, FaEnvelope, FaLink } from 'react-icons/fa';

export const iconMap = {
  FaYoutube: FaYoutube,
  FaTiktok: FaTiktok,
  FaInstagram: FaInstagram,
  FaWhatsapp: FaWhatsapp,
  FaGlobe: FaGlobe,
  FaTwitter: FaTwitter,
  FaGithub: FaGithub,
  FaLinkedin: FaLinkedin,
  FaEnvelope: FaEnvelope,
  FaLink: FaLink // Default fallback
};

export const getIconByKey = (iconKey) => {
  return iconMap[iconKey] || FaLink;
};
