import { useEffect, useRef } from "react";

export default function AnalogClock() {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    let frame;

    const update = () => {
      const now = new Date();

      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      const minutes = now.getMinutes() + seconds / 60;
      const hours = now.getHours() % 12 + minutes / 60;

        if (hourRef.current) hourRef.current.style.transform = `translate(-50%, 0) rotate(${hours * 30}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `translate(-50%, 0) rotate(${minutes * 6}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `translate(-50%, 0) rotate(${seconds * 6}deg)`;

      frame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(frame);
  }, []);

  const size = 128;      // w-32 = 128px
  const center = size / 2;
  const numberRadius = 42;
  const tickRadius = 58;

  return (
      <div className="relative w-32 h-32 rounded-full bg-white shadow-md border border-gray-200">

        {/* Tick Marks */}
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              transform: `rotate(${i * 6}deg) translateY(-${tickRadius}px)`
            }}
          >
            <div
              className={`mx-auto ${
                i % 5 === 0
                  ? "w-[2px] h-2 bg-black"
                  : "w-[1px] h-1 bg-gray-400"
              }`}
            />
          </div>
        ))}

        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const number = i + 1;
          const angle = (number - 3) * (Math.PI / 6);

          const x = center + numberRadius * Math.cos(angle);
          const y = center + numberRadius * Math.sin(angle);

          return (
            <div
              key={number}
              className="absolute text-[9px] font-medium text-gray-800"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {number}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          ref={hourRef}
          className="absolute bottom-1/2 left-1/2 w-[2px] h-6 bg-black rounded-full origin-bottom"
        />

        {/* Minute Hand */}
        <div
          ref={minuteRef}
          className="absolute bottom-1/2 left-1/2 w-[1.5px] h-9 bg-black rounded-full origin-bottom"
        />

        {/* Second Hand */}
        <div
          ref={secondRef}
          className="absolute bottom-1/2 left-1/2 w-[1px] h-11 bg-red-500 rounded-full origin-bottom"
        />

        {/* Center Dot */}
        <div className="absolute w-2 h-2 bg-black rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
  );
}
