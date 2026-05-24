
const ProfileCard = ({ name, bio, avatarUrl }) => {
  return (
    <div className="flex flex-col items-center justify-center pt-10 pb-6 px-4">
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 blur-md opacity-70"></div>
        <img
          src={avatarUrl}
          alt={name}
          className="relative w-28 h-28 rounded-full border-2 border-slate-800 object-cover shadow-xl"
        />
      </div>
      <h1 className="text-2xl font-bold text-slate-100 mb-2">{name}</h1>
      <p className="text-slate-400 text-center text-sm max-w-sm">{bio}</p>
    </div>
  );
};

export default ProfileCard;
