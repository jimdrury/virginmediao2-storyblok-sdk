export const NavSkeleton = () => {
  return (
    <div className="menu w-full">
      <div className="flex flex-col gap-3">
        <div className="skeleton h-6 w-[50%]" />
        <div className="skeleton h-6 w-[75%]" />
        <div className="skeleton h-6" />
      </div>
    </div>
  );
};
