
import { Link } from 'react-router-dom';

const BrandLogo = () => {
  return (
    <Link 
      to="/" 
      className="text-xl md:text-2xl font-semibold tracking-tight flex items-center"
    >
      <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-md mr-2">
        AI
      </span>
      AI Spain Homes
    </Link>
  );
};

export default BrandLogo;
