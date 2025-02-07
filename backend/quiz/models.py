from django.db import models


class Quiz(models.Model):
    owner = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    questionTotal = models.PositiveIntegerField(default=0)
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE)
    tags = models.ManyToManyField('categories.Tag')
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title
    

class Question(models.Model):
    quiz = models.ForeignKey('Quiz', on_delete=models.CASCADE)
    content = models.TextField()

    def __str__(self):
        return f"{self.content[:25]}...?" if len(self.content) >= 25 else f"{self.content}?"
    

class Option(models.Model):
    question = models.ForeignKey('Question', on_delete=models.CASCADE)
    content = models.CharField(max_length=255)
    is_answer = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.content[:25]}...?" if len(self.content) >= 25 else f"{self.content}"
    

class UserQuiz(models.Model):
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    quiz = models.ForeignKey('quiz.Quiz', on_delete=models.CASCADE)
    
    @property
    def score(self):
        total = 0
        for user_question_option_map in self.userquestionoptionmap_set.all():
            if user_question_option_map.option.is_answer:
                total += 1
        return total


    def __str__(self):
        return f"{self.user.email} - {self.quiz.title}"
    

class UserQuestionOptionMap(models.Model):
    user_quiz = models.ForeignKey('UserQuiz', on_delete=models.CASCADE)
    question = models.ForeignKey('quiz.Question', on_delete=models.CASCADE)
    option = models.ForeignKey('quiz.Option', on_delete=models.CASCADE)

    def __str__(self): 
        return f"{self.question.content[:25]} - {self.option.content[:25]}"