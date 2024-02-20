import Link from 'next/link';
import Search from '@/components/Search';
import Container from '@/components/Container';

export default function Nav() {
  return (
    <nav className="navbar px-0 py-4">
      <Container className="flex-col sm:flex-row items-center">
        <div>
          <Link href="/" className="btn btn-ghost text-lg">
            OSRS Items
          </Link>
        </div>
        <div className="mt-3 sm:mt-0 ml-auto lg:ml-36 w-full sm:w-96">
          <Search />
        </div>
      </Container>
    </nav>
  );
}
