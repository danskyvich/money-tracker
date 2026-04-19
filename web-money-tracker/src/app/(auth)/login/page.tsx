import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage({children}: {children: React.ReactNode}) {
    return (
      <div className="flex flex-1 flex-row w-full">

        {/**Left side */}
        <div className="flex flex-1 flex-col items-center justify-center bg-(--color-bg-base)">
          {/**Form here */}
          <form className='flex gap-5 flex-col'>
            {/**Input */}
            <div className="flex flex-col h-fit gap-5">
              <Input
                placeholder="Enter your email here..."
                label="Email"
                id="email"
                type="email"
              />
              <Input
                placeholder="Enter your password here..."
                label="Password"
                id="password"
                type="password"
              />
            </div>

            {/**Buttons */}
            <div className='flex flex-col h-fit'>
                <Button
                    className=''
                    variant='primary'
                    text="Log in"
                />
            </div>
          </form>
        </div>

        <div className="flex flex-4 flex-col bg-(--color-bg-secondary)"></div>
      </div>
    );
}