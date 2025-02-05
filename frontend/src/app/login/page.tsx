import { LoginForm } from "@/components/login-form"

import askLogo from '../../assets/images/ask.png';

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img src={askLogo} alt="" className="w-[1.8rem]"/>
          QuizMe
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
