import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

// Individual Page Component
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="bg-white shadow-md border-r border-gray-100" ref={ref}>
      <div className="h-full p-10 flex flex-col relative">
        {/* Subtle "Lined Paper" Effect */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />
        
        <div className="relative z-10 flex-grow">
          <h2 className="text-xl font-bold text-blue-400 mb-6 uppercase tracking-tighter">
            Entry #{props.number}
          </h2>
          <div className="text-gray-700 leading-relaxed">
            {props.children}
          </div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-300 italic">
          Property of the Author — Page {props.number}
        </div>
      </div>
    </div>
  );
});

const SpiralNotebook = () => {
  const book = useRef();

  return (
    <div className=" bg-zinc-100 flex flex-col  ">
      
      <div className="relative">
        
        {/* LEFT VERTICAL SPIRAL */}
        <div className="absolute -left-5 top-4 bottom-4 z-20 flex flex-col justify-between py-2">
          {[...Array(18)].map((_, i) => (
            <div 
              key={i} 
              className="h-2 w-10 bg-gradient-to-b from-gray-400 via-gray-100 to-gray-500 rounded-full shadow-sm border-y border-gray-400 -rotate-12" 
            />
          ))}
        </div>

        {/* THE NOTEBOOK */}
        <div className="shadow-[20px_20px_60px_rgba(0,0,0,0.2)] rounded-r-lg overflow-hidden border-l-[12px] border-zinc-800">
          <HTMLFlipBook
            width={550}
            height={500}
            size="stretch"
            minWidth={300}
            maxWidth={800}
            minHeight={400}
            maxHeight={1000}
            maxShadowOpacity={0.5}
            showCover={false}
            mobileScrollSupport={true}
            ref={book}
            className="bg-white"
            style={{ boxShadow: 'inset 20px 0 30px -20px rgba(0,0,0,0.2)' }}
          >
            <Page number="1">
              <h1 className="text-3xl font-serif text-gray-800">The Left-Bound Journal</h1>
              <p className="mt-6">The spiral has been moved to the left axis. You can still grab the right edge of this page to flip it with a 3D curl.</p>
              <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-200 text-sm italic">
                "Note: The page-flip library handles the 3D mesh deformation automatically when you drag the corners."
              </div>
            </Page>

            <Page number="2">
              <p>Tailwind CSS is used here to create the vertical metal rings using a flex-col container and a slight rotation to mimic real binding physics.</p>
            </Page>

            <Page number="3">
              <div className="space-y-4">
                <div className="h-2 w-full bg-gray-100" />
                <div className="h-2 w-full bg-gray-100" />
                <div className="h-2 w-3/4 bg-gray-100" />
              </div>
            </Page>

            <Page number="4">
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 font-serif text-2xl">End of Section</p>
              </div>
            </Page>
          </HTMLFlipBook>
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="mt-4 flex items-center justify-center w-full gap-8">
        <button 
          onClick={() => book.current.pageFlip().flipPrev()}
          className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span> Back
        </button>
        <div className="h-1 w-24 bg-gray-300 rounded-full" />
        <button 
          onClick={() => book.current.pageFlip().flipNext()}
          className="group flex items-center gap-2 text-gray-500 hover:text-black transition-colors"
        >
          Next <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default SpiralNotebook;