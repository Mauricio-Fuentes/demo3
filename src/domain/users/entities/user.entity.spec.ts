import { User, UserStatus } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('should create a new user with default values', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      expect(user.id).toBe('user-1');
      expect(user.name).toBe('Mauricio');
      expect(user.email).toBe('mauricio@example.com');
      expect(user.password).toBe('secreto123');
      expect(user.status).toBe('ACTIVE');
      expect(user.scope).toBe('openid profile email');
      expect(user.dateRegister).toBeInstanceOf(Date);
      expect(user.dateModify).toBeNull();
    });

    it('should set dateRegister to current date', () => {
      const beforeCreation = new Date();
      const user = User.create({
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });
      const afterCreation = new Date();

      expect(user.dateRegister.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime(),
      );
      expect(user.dateRegister.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime(),
      );
    });
  });

  describe('rehydrate', () => {
    it('should recreate user from existing data', () => {
      const dateRegister = new Date('2024-01-01');
      const dateModify = new Date('2024-01-02');

      const user = User.rehydrate({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'INACTIVE',
        scope: 'openid profile email',
        dateRegister,
        dateModify,
      });

      expect(user.id).toBe('user-1');
      expect(user.name).toBe('Mauricio');
      expect(user.email).toBe('mauricio@example.com');
      expect(user.password).toBe('secreto123');
      expect(user.status).toBe('INACTIVE');
      expect(user.dateRegister).toEqual(dateRegister);
      expect(user.dateModify).toEqual(dateModify);
    });
  });

  describe('getters', () => {
    it('should return correct property values', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      expect(user.id).toBe('user-1');
      expect(user.name).toBe('Test User');
      expect(user.email).toBe('test@example.com');
      expect(user.password).toBe('password123');
      expect(user.status).toBe('ACTIVE');
    });
  });

  describe('updateName', () => {
    it('should update user name and set dateModify', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Old Name',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const beforeUpdate = new Date();
      const updatedUser = user.updateName('New Name');
      const afterUpdate = new Date();

      expect(updatedUser.name).toBe('New Name');
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.dateModify).toBeInstanceOf(Date);
      expect(updatedUser.dateModify!.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(updatedUser.dateModify!.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });

    it('should not mutate original user', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Original Name',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const updatedUser = user.updateName('New Name');

      expect(user.name).toBe('Original Name');
      expect(user.dateModify).toBeNull();
      expect(updatedUser.name).toBe('New Name');
    });
  });

  describe('updateStatus', () => {
    it('should update user status and set dateModify', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const beforeUpdate = new Date();
      const updatedUser = user.updateStatus('INACTIVE');
      const afterUpdate = new Date();

      expect(updatedUser.status).toBe('INACTIVE');
      expect(updatedUser.id).toBe(user.id);
      expect(updatedUser.name).toBe(user.name);
      expect(updatedUser.dateModify).toBeInstanceOf(Date);
      expect(updatedUser.dateModify!.getTime()).toBeGreaterThanOrEqual(
        beforeUpdate.getTime(),
      );
      expect(updatedUser.dateModify!.getTime()).toBeLessThanOrEqual(
        afterUpdate.getTime(),
      );
    });

    it('should not mutate original user', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const updatedUser = user.updateStatus('INACTIVE');

      expect(user.status).toBe('ACTIVE');
      expect(user.dateModify).toBeNull();
      expect(updatedUser.status).toBe('INACTIVE');
    });
  });

  describe('toPrimitives', () => {
    it('should return all properties as plain object', () => {
      const dateRegister = new Date('2024-01-01');
      const dateModify = new Date('2024-01-02');

      const user = User.rehydrate({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister,
        dateModify,
      });

      const primitives = user.toPrimitives();

      expect(primitives).toEqual({
        id: 'user-1',
        name: 'Mauricio',
        email: 'mauricio@example.com',
        password: 'secreto123',
        status: 'ACTIVE',
        scope: 'openid profile email',
        dateRegister,
        dateModify,
      });
    });

    it('should return a new object (not reference)', () => {
      const user = User.create({
        id: 'user-1',
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
        status: 'ACTIVE',
        scope: 'openid profile email',
      });

      const primitives1 = user.toPrimitives();
      const primitives2 = user.toPrimitives();

      expect(primitives1).not.toBe(primitives2);
      expect(primitives1).toEqual(primitives2);
    });
  });
});

