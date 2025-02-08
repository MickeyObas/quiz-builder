import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import askLogo from '../../assets/images/ask.png';
  import { Link } from "react-router-dom";
  

const Home = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
        <div className="w-4/5 md:w-1/3 flex flex-col justify-center">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl flex justify-center items-center">
                    <img src={askLogo} alt="" className="w-[1.8rem]"/>
                    <h1 className="text-2xl ms-2">QuizMe</h1>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-y-2">
                <Button asChild>
                  <Link to="/quiz">Start New Quiz</Link>
                </Button>
                <Button asChild>
                  <Link to="/quiz/create/">Create Quiz</Link>
                </Button>
                <Button asChild>
                  <Link to="/profile">My Profile</Link>
                </Button>
              </CardContent>
            </Card>                
        </div>
    </div>
  )
};

export default Home;