import RequireAuth from '@/components/auth/RequireAuth';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth allow={['dealer']}>{children}</RequireAuth>;
}
