import Spinner from "./spinner";

export default function LoadingModal({message}:{message: string}) {
  return (
    <div className="flex w-100 sm:w-110 md:w-125 lg:w-140 xl:w-160 border border-(--color-border-default) rounded-lg bg-(--color-bg-secondary) items-center justify-center gap-3 p-5">
      <Spinner />
      <p className="text-[0.9rem] font-mono">{message}</p>
    </div>
  );
}
