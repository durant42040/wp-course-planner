import { Spinner } from "./ui/shadcn-io/spinner";

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="flex justify-center">
          <Spinner />
        </div>
        <p className="mt-4 text-lg">Loading courses...</p>
      </div>
    </div>
  );
}
