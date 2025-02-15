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
import baseURL from "@/constants"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

type LoginData = {
  email: string,
  password: string
};

type ErrorData = {
  email: string,
  password: string,
  error: string // Non-field error
}

type User = {
  id: string,
  nickname: string,
  email: string,
  profile_picture: string | null
}

type AuthData = {
  user: User | null,
  refresh: string,
  access: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const {login, user} = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ErrorData>({
    email: '',
    password: '',
    error: '' 
  });
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!email){
      setError((prev) => ({
        ...prev,
        email: 'Please enter your email address'
      }));
      return;
    };
    if(!password){
      setError((prev) => ({
        ...prev,
        password: 'Please enter your password'
      }));
      return;
    };

    const loginData: LoginData = {
      email: email,
      password: password
    };

    try{
      setLoading(true);
      const response = await fetch(`${baseURL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      if(!response.ok){
        const error = await response.json();
        if(error.error){
          setError((prev) => ({
            ...prev,
            error: error.error
          }))
        }
        console.log(error);
        console.log("Bad response");
      }else{
        const data: AuthData = await response.json();
        console.log(data);
        login(data);
        setEmail('');
        setPassword('');
        setError({
          email: '',
          password: '',
          error: ''
        });
        navigate('/');
      }
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back!</CardTitle>
          <CardDescription>
            Login with your Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <svg fill="#000000" width="800px" height="800px" viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin" className="jam jam-google"><path d='M4.376 8.068A5.944 5.944 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10.019 10.019 0 0 1-.044 3.956 9.998 9.998 0 0 1-3.52 5.71A9.958 9.958 0 0 1 10 20 9.998 9.998 0 0 1 1.118 5.401 9.998 9.998 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114z' /></svg>
                  Login with Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-neutral-200 dark:after:border-neutral-800">
                <span className="relative z-10 bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
              <p className="text-red-500 text-sm font-medium">{error.error}</p>
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
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required
                    onChange={handlePasswordChange} 
                    value={password}
                  />
                  <p className="text-red-500 text-sm font-medium">{error.password}</p>
                </div>
                <Button type="submit" className="w-full">
                  {loading ? 'Loading...': 'Login'}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
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
