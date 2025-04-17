import { BaseRepository } from './base.repository.js';
import { User } from '../models/user.model.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async updatePassword(id, hashedPassword) {
    return this.update(id, { password: hashedPassword });
  }

  async findUsersByRole(role) {
    return this.find({ role });
  }
} 