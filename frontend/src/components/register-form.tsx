import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"


type ErrorState = {
  email: string,
  nickname: string,
  password: string,
  password2: string
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState<ErrorState>({
    email: '',
    nickname: '',
    password: '',
    password2: '',
  })

  const validateEmail = () => {
    if(!email){
      setError((prev) => ({
        ...prev,
        email: 'Please enter your email address'
      }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      setError((prev) => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
  }};

  const validateNickname = () => {
    if(!nickname){
      setError((prev) => ({
        ...prev,
        nickname: "Please enter a nickname to use on QuizMe"
      }));
      return false;
    }
  }

  const validatePassword = () => {
    let passwordValid = true;
    if(!password){
      passwordValid = false;
      setError((prev) => ({
        ...prev,
        password: 'Please enter your password'
      }))
    };

    return passwordValid;
  }

  const validatePassword2 = () => {
    let password2Valid = true;
    if(password && !password2){
      password2Valid = false;
      setError((prev) => ({
        ...prev,
        password2: 'Please re-enter your password for confirmation'
      }))
    }

    if(password2 && password !== password2){
      password2Valid = false;
      setError((prev) => ({
        ...prev,
        password2: 'Passwords do not match'
      }))
    };

    return password2Valid;
  }

  const validate = () => {
    let isValid = true;
    if(!validateEmail()) isValid = false;
    if(!validateNickname()) isValid = false;
    if(!validatePassword()) isValid = false;
    if(!validatePassword2()) isValid = false;
    return isValid;
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({
      ...prev,
      email: ''
    }))
    setEmail(e.target.value);
  }

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({
      ...prev,
      nickname: ''
    }))
    setNickname(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({
      ...prev,
      password: ''
    }))
    setPassword(e.target.value);
  }

  const handlePassword2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({
      ...prev,
      password2: ''
    }))
    setPassword2(e.target.value);
  }

  const handleRegisterButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!validate()){
      return;
    }
    e.preventDefault();
    console.log("Register clicked!!");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to QuizMe!</CardTitle>
          <CardDescription>
            Register with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg fill="#000000" width="800px" height="800px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" class="jam jam-google"><path d='M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z' /></svg>
                  Continue with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">
                <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                  Or any other email
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={handleEmailChange}
                    value={email}
                  />
                  <p className="text-red-500 text-sm font-medium">{error.email}</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Enter your nickname"
                    required
                    onChange={handleNicknameChange}
                    value={nickname}
                  />
                  <p className="text-red-500 text-sm font-medium">{error.nickname}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    value={password}
                    onChange={handlePasswordChange} 
                  />
                  <p className="text-red-500 text-sm font-medium">{error.password}</p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password2">Confirm Password</Label>
                  </div>
                  <Input 
                    id="password2" 
                    type="password" 
                    required
                    value={password2}
                    onChange={handlePassword2Change} 
                  />
                  <p className="text-red-500 text-sm font-medium">{error.password2}</p>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleRegisterButtonClick}
                  >
                  Register
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-neutral-500 [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-neutral-900  dark:text-neutral-400 dark:[&_a]:hover:text-neutral-50">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
