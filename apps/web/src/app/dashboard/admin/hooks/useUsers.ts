'use client';

import { useState, useEffect } from 'react';
import { User, UserPermissions } from '../types/user.types';
import { UsersService } from '../services/users.service';

export function useUsers(id?: string) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const fetchData = async () => {
      try {
        if (id) {
          const data = await UsersService.getUserById(id);
          if (isMounted) setUser(data);
        } else {
          const data = await UsersService.getUsers();
          if (isMounted) setUsers(data);
        }
      } catch (err) {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Frontend Permissions simulation
  const permissions: UserPermissions = {
    canViewUser: true,
    canEditUser: true,
    canSuspendUser: true,
    canResetPin: true,
    canViewPayments: true,
    canViewBookings: true,
  };

  return {
    users,
    user,
    isLoading,
    isError,
    permissions,
  };
}
