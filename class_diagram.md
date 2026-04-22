# Class Diagram: Stagify Backend (PHP) - Updated

This diagram represents the logical connection between the frontend interactions and the database schema, reflecting that every post has an associated quiz.

```mermaid
classDiagram
    class User {
        +int userId
        +string username
        +string email
        +string password
        +string type
        +login(email, password)
        +logout()
        +register(userData)
    }

    class Student {
        +int studentId
        +int userId
        +string university
        +string cin
        +string field
        +int age
        +string address
        +viewPosts(filter)
        +enrollInPost(postId)
        +submitQuizResults(postId, results)
    }


    class Enterprise {
        +int enterpriseId
        +int userId
        +string name
        +bool validity
        +string address
        +createPost(postData)
        +manageQuiz(postId, quizData)
        +viewApplications(postId)
    }

    class Post {
        +int postId
        +int enterpriseId
        +string title
        +string content
        +array requirements
        +getDetails()
        +getAllPosts()
    }

    class Quiz {
        +int quizId
        +int postId
        +array content
        +getQuestionsByPostId(postId)
        +calculateScore(userAnswers)
    }

    class Application {
        +int id
        +int studentId
        +int postId
        +int score
        +array wrongAnswers
        +array correctAnswers
        +string acceptState
        +saveResults(studentId, postId, score, wrong, correct)
        +updateStatus(newState)
    }

    class Database {
        -connection
        +connect()
        +query(sql)
    }

    User <|-- Student : extends
    User <|-- Enterprise : extends
    Enterprise "1" -- "0..*" Post : creates
    Post "1" -- "1" Quiz : has_one
    Student "1" -- "0..*" Application : passes_quiz_for
    Post "1" -- "0..*" Application : evaluated_by
    Application "0..*" -- "1" Quiz : evaluates_performance_of
```

## Refined Logic Flow

1.  **Mandatory Assessment**: Every `Post` created by an `Enterprise` must have an associated `Quiz`.
2.  **Student Interaction**:
    *   A `Student` views a `Post`.
    *   The "Enrollment" process triggers the `Quiz` interface.
    *   Upon completion, `submitQuizResults` is called.
3.  **Candidature**: The `Application` class (mapping to the `passedUsers` table) serves as the bridge between a `Student` and a `Post`. It stores the results of the `Quiz` and the status of the application (`acceptState`).
4.  **Visibility Logic**:
    *   If `acceptState` is **accepted**: Enterprise sees full details (email, age, address, specialty).
    *   If `acceptState` is **rejected** or **pending**: Enterprise only sees specialty and age.
5.  **Data Persistence**: All classes interact with the `Database` utility for CRUD operations.
