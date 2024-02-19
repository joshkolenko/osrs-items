export default function Container({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="container mx-auto text-center py-16 prose">{children}</div>
  );
}
