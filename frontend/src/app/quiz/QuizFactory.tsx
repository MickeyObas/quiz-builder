import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus } from 'lucide-react';
import { Dispatch, FC, forwardRef, SetStateAction, useImperativeHandle } from "react";

import { useState } from "react";
import baseURL from "@/constants";
import { fetchWithAuth } from "@/utils.tsx";

type QuizFactoryProps = {
  quizId: string | undefined,
  setQuestions: Dispatch<SetStateAction<string[]>>,
  questionTotal: number,
  questionCount: number
};

type QuestionData = {
  content: string,
  options: string[],
  answer: number | null
};

const QuizFactory = forwardRef(({ quizId, questionCount, setQuestions, questionTotal }: QuizFactoryProps, ref) => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<null | number>(null);
  const [options, setOptions] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({
    handleSaveQuestion
  }));

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  }

  const handleOptionChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newOptions = [...options];
    newOptions[idx] = e.target.value;
    setOptions(newOptions);
  };

  const handleSaveQuestion = async () => {
    const questionData: QuestionData = {
      content: question,
      options: options,
      answer: answer
    }
    if(question && answer !== null && options.every((option) => option)){
      // POST question
      try {
        const response = await fetchWithAuth(`${baseURL}/api/quiz/${quizId}/questions/create/`, {
          method: 'POST',
          body: JSON.stringify(questionData),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if(!response.ok){
          const error = await response.json();
          console.log(error);
        }else{
          const data = await response.json();
          console.log(data);
        }
      }catch(err){
        console.error(err);
      }
      // Update questions
      setQuestions((prev) => ([...prev, question]));
      setQuestion('');
      setAnswer(null);
      setOptions([]);
    }
  }

  return (
    <>
      <div className="mt-4 flex justify-center">
        {questionCount < questionTotal && (
          <Button onClick={() => setIsAddingQuestion(true)}>
          Add Question <Plus/>
        </Button>
        )}
      </div>
      {isAddingQuestion && (questionCount < questionTotal) && (
        <div className="mt-8">
        <div className="flex gap-2 items-center">
          <Label htmlFor="title" className="w-1/4 text-right">Question</Label>
          <Input
            id="title"
            type="text"
            placeholder=""
            required
            value={question}
            onChange={handleQuestionChange}
          />
        </div>
      </div>
      )}
      {options && options.map((option, idx) => (
        <div key={idx} className="mt-4">
          <div className="flex gap-2 items-center">
            <Label htmlFor="title" className="w-1/4 text-right">Option</Label>
            <Input
              id="title"
              type="text"
              placeholder=""
              required
              value={option}
              onChange={(e) => handleOptionChange(idx, e)}
            />
            <div className="flex flex-col gap-1.5 justify-center">
              <p className="text-xs">Answer?</p>
              <input 
                type="checkbox" 
                name="" 
                id="" 
                className="scale-125" 
                checked={answer === idx}
                onChange={() => setAnswer(idx)}
              />
            </div>
          </div>
        </div>
      ))}
      {(question && options.length < 4) && (
        <div className="mt-4 flex justify-center">
          <Button onClick={addOption}>
            Add Option <Plus/>
          </Button>
        </div>
      )}
    </>
  )
});

export default QuizFactory;