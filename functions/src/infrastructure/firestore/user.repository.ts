import { db } from "../firebase";
import { User } from "../../domain/entities/user.entity";

const USERS_COLLECTION = "users";

export class UserRepository {
  async getUser(email: string): Promise<User | null> {
    const snapshot = await db.collection(USERS_COLLECTION).where('email', '==', email).get();
    if (snapshot.empty) return null;
  
    const userData = snapshot.docs[0].data();
    if (!userData) return null;
  
  
    return new User({
      id: userData.id,
      email: userData.email,
    });
  }

  async create(user: User): Promise<void> {
    await db.collection(USERS_COLLECTION).doc(user.id).set(user.toJSON());
  }
}
