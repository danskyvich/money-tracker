export default function BottomBar() {
    return(
        <div className="flex gap-2 text-[0.8rem] font-mono w-full h-fit bg-(--color-bg-secondary) py-2 items-center justify-center">
          <a className="hover:underline" href={"/terms-and-conditions"}>Terms and conditions</a>
          {" • "}
          <a className="hover:underline" href={"/privacy-policy"}>Privacy Policy</a>
        </div>
    )
}