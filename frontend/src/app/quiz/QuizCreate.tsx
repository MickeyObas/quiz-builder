import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import baseURL from "@/constants";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "@/utils.tsx";
 

type Category = {
  id: number,
  title: string
};

type Quiz = {
  title: string,
  category: string,
  questionTotal: string
}
  
const QuizCreate = () => {

  const navigate = useNavigate();
  const [title, setTitle] = useState(''); 
  const [category, setCategory] = useState(''); 
  const [categories, setCategories] = useState<Category[]>([]); 
  const [questionTotal, setQuestionTotal] = useState(''); 

  const handleTitleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (categoryId: string) => {
    setCategory(categoryId);
  };

  const handleQuestionTotalChange = (total: string) => {
    setQuestionTotal(total);
  };

  const handleCreateQuizClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(!title || !categories || !questionTotal){
      return;
    };

    const quizData: Quiz = {
      title: title,
      category: category,
      questionTotal: questionTotal
    }

    // Create Quiz
    try{
      const response = await fetchWithAuth(`${baseURL}/api/quiz/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizData)
      });
      if(!response.ok){
        const error = await response.json();
      }else{
        const data = await response.json();
        navigate(`/quiz/create/${data.id}/questions/`);
      }
    }catch(err){
      console.error(err);
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try{
        const response = await fetchWithAuth(`${baseURL}/api/categories/`, {
          method: 'GET'
        });

        if(!response.ok){
          const error = await response.json();
        }else{
          const data = await response.json();
          setCategories(data);
        };
      }catch(err){
        console.error(err);
      }
    };
    fetchCategories();
  }, [])

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
      <div className="w-2/5 flex flex-col justify-center">
        <Card className="pt-6">
          <CardContent>
            <h1 className="text-center text-2xl font-medium">Create a Quiz</h1>
            <form className="mt-5">
              <div className="grid gap-6">
                <div className="flex gap-2 items-center">
                  <Label htmlFor="title" className="w-1/4 text-right">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder=""
                    required
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Label htmlFor="title" className="w-1/4 text-right">Category</Label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories && categories.map((category, idx) => (
                        <SelectItem key={idx} value={category.id.toString()}>{category.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 items-center">
                  <Label htmlFor="total" className="w-1/4 text-right">Number of questions</Label>
                  <Select onValueChange={handleQuestionTotalChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={'5'}>5</SelectItem>
                      <SelectItem value={'10'}>10</SelectItem>
                      <SelectItem value={'15'}>15</SelectItem>
                      <SelectItem value={'25'}>20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-center mt-5">
                <Button className="w-1/3" onClick={handleCreateQuizClick}>Next</Button>
              </div>
            </form>
            </CardContent>
          </Card>                
      </div>
    </div>
  )
};

export default QuizCreate;