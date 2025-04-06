import { Task, TaskProps } from "../../domain/entities/task.entity";
import { db } from "../firebase";

const TASKS_COLLECTION = "tasks";

interface TaskFirestoreData {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
  userId: string;
}

export class TaskRepository {
  async getAll(): Promise<Task[]> {
    const snapshot = await db.collection(TASKS_COLLECTION).get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as TaskFirestoreData;

      const taskData: TaskProps = {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId,
      };

      return new Task(taskData);
    });
  }

  async create(task: Task): Promise<void> {
    await db.collection(TASKS_COLLECTION).doc(task.id).set(task.toJSON());
  }

  async getById(id: string): Promise<Task | null> {
    const doc = await db.collection(TASKS_COLLECTION).doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data() as TaskFirestoreData;

    const taskData: TaskProps = {
      id: doc.id,
      title: data.title,
      description: data.description,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      userId: data.userId,
    };

    return new Task(taskData);
  }

  async update(task: Task): Promise<void> {
    await db.collection(TASKS_COLLECTION).doc(task.id).update(task.toJSON());
  }

  async delete(id: string): Promise<void> {
    await db.collection(TASKS_COLLECTION).doc(id).delete();
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const snapshot = await db
      .collection(TASKS_COLLECTION)
      .where("userId", "==", userId)
      .get();
  
    return snapshot.docs.map((doc) => {
      const data = doc.data() as TaskFirestoreData;
  
      const taskData: TaskProps = {
        id: doc.id,
        title: data.title,
        description: data.description,
        completed: data.completed,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId,
      };
  
      return new Task(taskData);
    });
  }


}

