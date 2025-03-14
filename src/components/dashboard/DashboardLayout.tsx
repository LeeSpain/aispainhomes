
import { Helmet } from 'react-helmet';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>{title} | SunnyHomeFinder</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="flex-1 pt-20 pb-16">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DashboardLayout;
