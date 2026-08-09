interface ToggleProps {
    enable: boolean,
    onEnable: (value: boolean) => void;
    onClick: () => void;
    className?: string,
}

export default function Toggle({ enable, onEnable, className, onClick }: ToggleProps) {
  return (
    <div
      className={`${className} ${enable && "bg-(--color-brand-green)/30"} flex items-center border border-(--color-brand-green) w-12 h-fit rounded-2xl cursor-pointer`}
      onClick={() => {onEnable(!enable), onClick}}
    >
      <div
        className={`flex rounded-[50%] w-5 self-start h-5 bg-(--color-brand-green) transition-transform duration-200 ${
          enable ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </div>
  );
}