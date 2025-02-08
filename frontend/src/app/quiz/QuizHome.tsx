import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import baseURL from "@/constants";
import { fetchWithAuth } from "@/utils.tsx";

type Quiz = {
  "id": number,
  "title": string,
  "owner": string,
  "category": string,
  "questions": string[],
  "questionTotal": number
}

const QuizHome = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number>();
  const selectedQuiz = quizzes.find((quiz) => quiz.id === selectedQuizId);

  // Get Quiz List
  useEffect(() => {
    const fetchQuizList = async () => {
      const response = await fetchWithAuth(`${baseURL}/api/quiz/`, {
        method: 'GET'
      });
      if(!response.ok){
        const error = await response.json();
        console.log(error);
        console.log("Bad response");
      }else{
        const data = await response.json();
        setQuizzes(data);
        console.log(data);
      }
    };
    fetchQuizList();
  }, []); 

  const startQuiz = async (quizId) => {
    // Create UserQuiz
    try {
      const response = await fetchWithAuth(`${baseURL}/api/quiz/${quizId}/create-user-quiz/`, {
        method: 'POST'
      });
      if(!response.ok){
        const error = await response.json();
        console.log(error);
      }else{
        const data = await response?.json();
        console.log(data);
        navigate(`/quiz/${quizId}/`);
      }
    }catch(err){
      console.error(err);
    };
  }

  return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
        <div className="w-3/5 flex flex-col justify-center">
            <Card className="pt-6">
              <CardContent className="flex">
                <div className="w-1/2 flex flex-col border-r-2 p-3">
                  <h2 className="text-center mb-3.5 font-medium text-xl">Available Quizzes</h2>
                  <ul className="flex flex-col gap-y-2">
                    {quizzes.length > 0 ? quizzes.map((quiz, idx) => (
                      <li 
                        key={idx}
                        className="text-sm underline decoration-blue-500 cursor-pointer"
                        onClick={() => setSelectedQuizId(quiz.id)}
                        >{quiz.title}</li>
                    )) : (
                      <div className="flex justify-center items-center">
                        <p>No Quizzes Yet</p>
                      </div>
                    )}
                  </ul>
                  <div className="flex flex-col"></div>
                </div>
                <div className="w-1/2 flex flex-col bg-slate-50 p-3 text-sm">
                  <h2 className="text-center mb-3.5 font-medium text-xl">Quiz Description</h2>
                  {selectedQuiz ? (
                    <>
                      <div className="py-1.5 flex flex-col gap-y-4">
                        <p>Title: {selectedQuiz?.title}</p>
                        <p>Number of questions: {selectedQuiz?.questions.length} / {selectedQuiz?.questionTotal}</p>
                        <p>Creator: {selectedQuiz?.owner}</p>
                        <Button 
                          className="mt-auto"
                          onClick={() => startQuiz(selectedQuizId)}
                          >Start Quiz</Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p>Select a quiz to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>                
        </div>
      </div>
  )
};

export default QuizHome;