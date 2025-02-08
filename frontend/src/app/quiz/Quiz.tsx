import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, FC } from "react";
import { fetchWithAuth } from "@/utils.tsx";
import baseURL from "@/constants";

type Question = {
  id: number,
  content: string,
  options: Option[]
}

type QuestionContainerProps = {
  quizId: string | undefined,
  currentQuestion: Question | undefined,
  prevQuestion: () => void,
  nextQuestion: () => void,
  questionIndex: number,
  questionTotal: number,
  handleOptionSelect: (questionId: number, optionId: number) => void,
  selectedOptions: Map<number, number>,
  handleSubmitQuiz: (quizId: string) => Promise<void>
}

type Option = {
  id: number,
  content: string,
  is_answer: boolean
}

type Quiz = {
  "id": number,
  "title": string,
  "owner": string,
  "category": string,
  "questions": Question[],
  "questionTotal": number | undefined
}

const Quiz = () => {
  const navigate = useNavigate();
  const {quizId} = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>();
  const [questionIndex, setQuestionIndex] = useState(0);
  const currentQuestion = quiz?.questions.find((question) => question.id === currentQuestionId) || quiz?.questions[questionIndex];
  const [selectedOptions, setSelectedOptions] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const fetchQuiz = async () => {
      try{
        setLoading(true);
        const response = await fetchWithAuth(`${baseURL}/api/quiz/${quizId}/`, {
          method: 'GET'
        });
        if(!response.ok){
          const error = await response?.json();
          console.log("Bad Response", error);
        }else{
          const data = await response?.json();
          console.log(data);
          setQuiz(data);
        }
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const prevQuestion = () => {
    if(questionIndex > 0){
      setQuestionIndex((prev) => prev - 1);
    }
  }

  const nextQuestion = () => {
    if(questionIndex < quiz?.questions.length - 1){
      setQuestionIndex((prev) => prev + 1);
    }
  };

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setSelectedOptions((prev) => new Map(prev).set(questionId, optionId));
  };

  const handleSubmitQuiz = async (quizId: string) => {
    const serializedResponses = Array.from(selectedOptions, ([questionId, optionId]) => ({
      questionId,
      optionId
    }));

    console.log(serializedResponses);

    // Send to backend
    try{
      const response = await fetchWithAuth(`${baseURL}/api/quiz/${quizId}/process/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serializedResponses)
      });
      if(!response.ok){
        const error = await response?.json();
        console.log("Whoops: ", error);
      }else{
        const data = await response?.json();
        console.log(data);
        navigate('/')
      }
    }catch(err){
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
        <div className="w-4/5 flex flex-col justify-center">
            <Card className="pt-6">
              <CardContent>
                <QuestionContainer 
                  quizId={quizId}
                  currentQuestion={currentQuestion}
                  prevQuestion={prevQuestion}
                  nextQuestion={nextQuestion}
                  questionIndex={questionIndex}
                  questionTotal={quiz?.questions.length}
                  handleOptionSelect={handleOptionSelect}
                  selectedOptions={selectedOptions}
                  handleSubmitQuiz={handleSubmitQuiz}
                />
              </CardContent>
            </Card>                
        </div>
      </div>
  )
};

const QuestionContainer: FC<QuestionContainerProps> = ({
  quizId,
  currentQuestion,
  prevQuestion,
  nextQuestion,
  questionIndex,
  questionTotal,
  handleOptionSelect,
  selectedOptions,
  handleSubmitQuiz
}) => {

  console.log(questionIndex,  0);

  return (
    <div className="flex flex-col">
      <p>{questionIndex+1}. {currentQuestion?.content}</p>
      <div className="flex flex-col gap-y-3 mt-28">
        {currentQuestion?.options && currentQuestion.options.map((option, idx) => (
          <Button 
            key={idx} 
            className={`whitespace-normal h-auto ${
              currentQuestion && selectedOptions.get(currentQuestion.id) === option.id 
                ? 'bg-neutral-200' 
                : ''
            }`}
            variant='outline'
            onClick={() => handleOptionSelect(currentQuestion.id, option.id)}
            >
          <div className="flex">
            {option.content}
          </div>
        </Button>
        ))}
      </div>
      <div className="flex mt-8 justify-between">
        <div>
          <Button variant="destructive">Quit</Button>
        </div>
        <div className="flex gap-2.5">
          {questionIndex > 0 && (
            <Button onClick={prevQuestion}>
              <CircleArrowLeft /> Previous
            </Button>
          )}
          {(questionIndex < questionTotal - 1) ? (
            <Button onClick={nextQuestion}>
              Next <CircleArrowRight />
            </Button>
          ) : (
            <Button onClick={() => handleSubmitQuiz(quizId)}>
              Submit <CircleArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz;