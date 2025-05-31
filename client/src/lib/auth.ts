import { User } from "@shared/schema";

export interface AuthUser extends Omit<User, 'password'> {}

class AuthManager {
  private storageKey = 'athletetravel_user';
  
  getCurrentUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
  
  setCurrentUser(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }
  
  clearCurrentUser(): void {
    localStorage.removeItem(this.storageKey);
  }
  
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
  
  async login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const { user } = await response.json();
    this.setCurrentUser(user);
    return user;
  }
  
  async register(userData: {
    email: string;
    password: string;
    fullName: string;
    sport: string;
  }): Promise<AuthUser> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    const { user } = await response.json();
    this.setCurrentUser(user);
    return user;
  }
  
  logout(): void {
    this.clearCurrentUser();
  }
}

export const auth = new AuthManager();
