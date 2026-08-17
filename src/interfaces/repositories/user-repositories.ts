import { User } from '../entities/user';

export interface UserRepository {
  create(user: User): Promise<User>;

  update(id: string, user: Partial<User>): Promise<User>;

  delete(id: string): Promise<void>;

  findById(id: string): Promise<User | null>;

  findByEmail(email: string): Promise<User | null>;

  list(): Promise<User[]>;
}
