import { injectable, inject } from 'tsyringe';

// import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';


interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider:IHashProvider,
  ) {}

  public async execute({ password, token }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if(!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if(!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatAt = userToken.created_at;
    const compareDate = addHours(tokenCreatAt, 2);

    if(isAfter(Date.now(), compareDate)){
      throw new AppError('Token expired.');
    }

    user.password = await this.hashProvider.gererateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;