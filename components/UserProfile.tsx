import { Session } from "next-auth";


const UserProfile = ({ session }: { session: Session }) => {
  return (
    <div className="flex mt-2">
      <div className="flex flex-row items-center justify-center">
        <p className="font-bold text-xl text-[#11191f] mr-1">З поверненням,</p>
        <h2 className="text-xl font-bold text-[#11191f]">
          {session?.user?.name}
        </h2>
      </div>
    </div>
  );
};

export default UserProfile;
