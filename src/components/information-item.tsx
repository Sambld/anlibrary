export const InformationItem = ({
  children,
  type,
  value,
}: {
  children?: React.ReactNode;
  type: string;
  value?: string | number;
}) => {
  return (
    <div className="flex gap-4 items-baseline">
      <span className="font-semibold text-gray-500 min-w-20">{type}:</span>
      {value && <span className="text-sm">{value}</span>}
      {children}
    </div>
  );
};
