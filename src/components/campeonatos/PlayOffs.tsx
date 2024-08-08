import { useSmoothScrollOnView } from "@/lib/SmoothScroll";
import PlayoffBracket from "./playoffs/PlayoffBracket";

export default function PlayOffs() {
  const containerRef = useSmoothScrollOnView('.smooth');

  return (
    <div ref={containerRef}>
      <div className="bg-zinc-800 rounded-xl">
        <h2 className="font-semibold text-2xl bg-zinc-900 p-4 rounded-t-xl smooth">PlayOffs</h2>

        <PlayoffBracket />


      </div>
    </div>
  );
}