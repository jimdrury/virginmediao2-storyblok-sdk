export const BreadcrumbsSkeleton = () => {
  return (
    <div className="breadcrumbs">
      <ul>
        <li>
          <div className="skeleton h-5 w-[20px]" />
        </li>
        <li>
          <div className="skeleton h-5 w-[100px]" />
        </li>
      </ul>
    </div>
  );
};
