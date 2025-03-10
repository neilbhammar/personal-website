import StickmanGame from "@/components/game/StickmanGame";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-100 to-indigo-50 p-4">
      <div className="w-full max-w-4xl">
        <StickmanGame />
      </div>
    </div>
  );
}
