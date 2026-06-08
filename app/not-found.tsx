import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center px-4 md:px-8 text-center font-sans">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-[#f5efe6] rounded-full flex items-center justify-center mb-8 relative">
        <span className="font-serif text-[#001410] text-4xl md:text-5xl font-bold">404</span>
      </div>
      
      <h1 className="font-serif text-3xl md:text-5xl text-[#001410] mb-4">
        Page Not Found
      </h1>
      
      <p className="text-zinc-600 text-sm md:text-base max-w-md mb-10 leading-relaxed">
        The silhouette you're looking for seems to have been retired. Let's get you back to our curated collections.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/collections" 
          className="bg-[#001410] text-white px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase hover:bg-[#775a19] transition-colors"
        >
          Explore Collections
        </Link>
        <Link 
          href="/" 
          className="bg-transparent border border-[#001410] text-[#001410] px-8 py-3.5 rounded text-xs font-bold tracking-wider uppercase hover:bg-zinc-100 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
