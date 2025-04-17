export class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async create(data) {
    return this.repository.create(data);
  }

  async findById(id) {
    return this.repository.findById(id);
  }

  async findOne(query) {
    return this.repository.findOne(query);
  }

  async find(query = {}, options = {}) {
    return this.repository.find(query, options);
  }

  async update(id, data) {
    return this.repository.update(id, data);
  }

  async delete(id) {
    return this.repository.delete(id);
  }

  async count(query = {}) {
    return this.repository.count(query);
  }
} 