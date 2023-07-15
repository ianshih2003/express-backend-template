/**
 * Resolves User ID from available request information
 */
interface IUserIdResolver {
  getUserId: (user: any) => string | undefined;
}

export class UserIdResolver implements IUserIdResolver {
  getUserId(user: any) {
    return user ? user.id : undefined;
  }
}
export const UserIdResolverInstance = new UserIdResolver();
