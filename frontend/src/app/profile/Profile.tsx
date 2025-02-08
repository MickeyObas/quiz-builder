import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import askLogo from '../../assets/images/ask.png';
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/utils.tsx";
import baseURL from "@/constants";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUserQuizzes = async () => {
      try {
        if (!user) return;
        const response = await fetchWithAuth(`${baseURL}/api/quiz/user/${user.id}`, {
          method: 'GET',
        });
        if (!response.ok) {
          const error = await response.json();
          console.log(error);
        } else {
          const data = await response.json();
          console.log(data);
          setUserQuizzes(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserQuizzes();
  }, [user]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-neutral-100 p-6 md:p-10 dark:bg-neutral-800">
      <div className="w-4/5 md:w-1/2 flex flex-col justify-center">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex justify-center items-center">
              <img src={askLogo} alt="QuizMe Logo" className="w-[1.8rem]" />
              <h1 className="text-2xl ms-2">QuizMe</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-4">
            <h3 className="text-center font-semibold text-lg">My Completed Quizzes</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 mx-auto">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-center">Quiz Title</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Quiz Category</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Quiz Score</th>
                  </tr>
                </thead>
                <tbody>
                  {userQuizzes.length > 0 ? (
                    userQuizzes.map((userQuiz, idx) => (
                      <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                        <td className="border border-gray-300 px-4 py-2 text-center">{userQuiz.quiz.title}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{userQuiz.quiz.category}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">{userQuiz.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                        No completed quizzes found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
