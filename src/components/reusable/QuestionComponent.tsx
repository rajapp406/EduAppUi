import { QuizAnswer } from "@/models/quiz";
import Card from "../ui/Card";
import { QuestionResponse, QuestionType } from "@/models/api";

export const QuestionComponent = ({
    currentQuestion,
    userAnswers,
    currentQuestionIndex,
    handleAnswerSelect,
}: {
    currentQuestion: QuestionResponse;
    userAnswers: QuizAnswer[];
    currentQuestionIndex: number;
    handleAnswerSelect: (answer: string) => void;
}) => {
    return (
        <Card className="p-8 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion?.questionText}
        </h3>

        {currentQuestion?.questionType === QuestionType.MCQ && currentQuestion?.options && (
          <div className="space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option.text)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${userAnswers[currentQuestionIndex]?.selectedOption === option.text
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${userAnswers[currentQuestionIndex]?.selectedOption === option.text

                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                    }`}>
                    {userAnswers[currentQuestionIndex]?.selectedOption === option.text
                      && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                  </div>
                  {option.text}
                </div>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.questionType === QuestionType.TRUE_FALSE && (
          <div className="space-y-3">
            {['True', 'False'].map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${userAnswers[currentQuestionIndex]?.selectedOption === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </Card>
    )
}