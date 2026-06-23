import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Footer from '../components/Footer.jsx';
import Logo from '../components/Logo.jsx';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <section className="max-w-xl text-center">
          <div className="mb-8 flex justify-center">
            <Logo showTagline />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">404</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            This path is not on the roadmap.
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            The page you’re looking for does not exist or may have moved.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default NotFound;
