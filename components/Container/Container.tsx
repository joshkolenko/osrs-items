export default function Container({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: React.HtmlHTMLAttributes<HTMLDivElement>['className'];
}) {
  return (
    <div className={'container mx-auto px-6 w-full ' + className}>
      {children}
    </div>
  );
}
