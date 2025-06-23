import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Next.js UI Library Starter
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          A basic starter project with API calling structure and reusable UI components built with Next.js, TypeScript, and Tailwind CSS.
          You can enhance it according to your requirements.
        </p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              View Demo
            </Link>

            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-md border border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Explore UI Library
            </Link>
          </div>

          <div className="text-sm text-gray-500 space-y-2">
            <p>Explore our Posts CRUD demo to see the components and API calling in action</p>
            <p>Check out shadcn/ui documentation for more components and customization options</p>
          </div>
        </div>
      </div>
    </div>
  );
}
