import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Lock, MailIcon } from "lucide-react";

export default function LoginPage() {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        {/**Card */}
        <div className="gap-10 items-center justify-center p-6 border border-[var(--color-border-default)] rounded-2xl w-125 shadow-[var(--shadow-sm)]">

          {/**Header */}
          <header>

          </header>
          <form>
            <Input
              placeholder="sample@email.com"
              label="Email"
              id="email"
              type="email"
              icon={<MailIcon size={18}/>}
            />
            <Input
              placeholder="min. 3 characters"
              label="Password"
              id="password"
              type="password"
              icon={<Lock size={18}/>}
            />

            <div className="gap-2 px-6">
              <Button 
              text="Log in" 
              type="button"
              />
            </div>
          </form>
        </div>
      </div>
    );
}