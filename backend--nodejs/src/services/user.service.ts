import { UserModel } from "../models/user/user.model";
import { UserDtoCreate, UserDtoUpdate, UserDtoFindQuery } from "../models/user/user.dto";

class UserService {
  static async create(req: Request, res: Response): Promise<void> {
    const data: UserDtoCreate = req.body;
    // Implement CREATE logic here
    res.status(201).send({ message: 'User created', data });
  }

  static async getById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement GET by ID logic here
    res.status(200).send({ message: 'Fetched User by ID', id });
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    const query: UserDtoFindQuery = req.query;
    // Implement GET ALL logic with query parameters
    res.status(200).send({ message: 'Fetched all Users', query });
  }

  static async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UserDtoUpdate = req.body;
    // Implement PATCH logic here
    res.status(200).send({ message: 'Updated User', id, data });
  }

  static async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    // Implement DELETE logic here
    res.status(200).send({ message: 'Deleted User', id });
  }
}

export default UserService;
