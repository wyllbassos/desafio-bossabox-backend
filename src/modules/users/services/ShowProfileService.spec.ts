import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';


let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(
      fakeUsersRepository,
    );
  })

  it('should be able show the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '12345'
    })

    const showUser = await showProfile.execute({ user_id: user.id });

    expect(showUser.name).toBe('John Doe');
    expect(showUser.email).toBe('johndoe@example.com');
  });

  it('should not be able show a non-existing user\'s profile', async () => {
    await expect(
      showProfile.execute({
        user_id: 'non-exist-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
})
