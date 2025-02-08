import {
    Card,
    CardContent,
  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import baseURL from "@/constants";
import QuizFactory from "./QuizFactory";
import { fetchWithAuth } from "@/utils.tsx";
  
  type QuizResponseData = {
    id: number,
    title: string,
    category: string,
    owner: number,
    questions: string[],
    questionTotal: string
  }
  
  const QuizCreate2 = () => {
    const navigate = useNavigate();
    const childRef = useRef(null);
    const [quiz, setQuiz] = useState<QuizResponseData | null>(null);
    const [questions, setQuestions] = useState<string[]>([]);
    const { quizId } = useParams();
    console.log(questions);

    const handleSaveQuestionClick = () => {
      childRef?.current?.handleSaveQuestion();
    }

    useEffect(() => {
      const fetchQuiz = async () => {
        try{
          const response = await fetchWithAuth(`${baseURL}/api/quiz/${quizId}/`, {
            method: 'GET'
          });
          if(!response.ok){
            const error = await response.json();
          }else{
            const data:QuizResponseData = await response.json();
            setQuestions(data.questions);
            setQuiz(data);
          }
        }catch(err){
          console.error(err);
        }
      };
      fetchQuiz();
    }, [quizId]);

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
        <div className="w-2/5 flex flex-col justify-center">
          <Card className="pt-6">
            <CardContent>
              <div className="flex items-center justify-center">
                <h1 className="text-center text-2xl font-medium me-4">Quiz Builder</h1>
                <p>({questions.length} / {quiz?.questionTotal})</p>
              </div>
              {questions.length < quiz?.questionTotal ? (
                <QuizFactory quizId={quizId} setQuestions={setQuestions} ref={childRef} questionTotal={quiz?.questionTotal} questionCount={questions.length} />
              ) : (
                <div className="flex justify-center items-center pt-4 -mb-2">
                  <p>Quiz complete. You may now return to Home.</p>
                </div>
              )}
              <div className="flex mt-8 justify-between">
                <Button>
                  <CircleArrowLeft /> Previous
                </Button>
                {(questions.length < quiz?.questionTotal) ? (
                  <Button
                  onClick={handleSaveQuestionClick}
                  >
                    Save Question <CircleArrowRight />
                  </Button>
                ) : (
                  <Button
                  onClick={() => navigate('/')}
                  >
                    Back to Home <CircleArrowRight />
                  </Button>
                )}
              </div>
            </CardContent>
            </Card>                
        </div>
      </div>
    )
  };
  
  export default QuizCreate2;