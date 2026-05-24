import { useAppContext } from '../../context/AppContext';
import ProfileCard from '../ProfileCard';
import LinkButton from '../LinkButton';
import SocialIcons from '../SocialIcons';
import BottomCTA from '../BottomCTA';

const PhonePreview = () => {
  const { profile, links } = useAppContext();

  return (
    <div className="hidden lg:flex shrink-0 w-[440px] border-l border-[var(--color-app-border)] bg-[var(--color-app-bg)] h-screen overflow-y-auto custom-scrollbar relative justify-center items-center py-10 transition-colors duration-300">

      {/* Phone Mockup Frame */}
      <div className="relative w-[340px] h-[720px] rounded-[48px] border-[10px] border-[var(--color-app-surface-hover)] bg-[var(--color-app-bg)] overflow-hidden shadow-2xl flex flex-col">

        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-32 h-6 bg-[var(--color-app-surface-hover)] rounded-b-3xl"></div>
        </div>

        {/* Inner Content Area - mimics public view */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 relative flex flex-col items-center">

          <div className="w-full flex flex-col pt-12 px-5 z-10 animate-fade-in">
            <ProfileCard
              name={profile.full_name}
              bio={profile.bio}
              avatarUrl={profile.avatar_url}
              verified={profile.verified}
            />

            <div className="w-full flex flex-col gap-3 mt-8">
              {links.filter(link => link.is_active).map((link) => (
                <LinkButton
                  key={link.id}
                  id={link.id}
                  title={link.title}
                  subtitle={link.subtitle}
                  url={link.url}
                  iconKey={link.icon_key}
                  featured={link.featured}
                  isActive={link.is_active}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center pb-8">
              <SocialIcons />
            </div>
          </div>

        </div>

        <div className="absolute bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <BottomCTA />
        </div>

      </div>

    </div>
  );
};

export default PhonePreview;
