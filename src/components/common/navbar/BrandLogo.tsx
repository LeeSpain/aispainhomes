import { Link } from 'react-router-dom';
import aiLogo from '@/assets/ai-logo-icon.png';

const BrandLogo = () => {
  return (
    <Link 
      to="/" 
      className="text-xl md:text-2xl font-semibold tracking-tight flex items-center"
    >
      <img 
        src={aiLogo} 
        alt="AI Homes Spain Logo" 
        className="w-8 h-8 rounded-md mr-2"
      />
      AI Homes Spain
    </Link>
  );
};

export default BrandLogo;
