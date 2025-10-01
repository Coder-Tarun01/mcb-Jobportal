import { Model, Optional } from 'sequelize';
export interface UserAttributes {
    id: string;
    email: string;
    name: string;
    password: string;
    phone?: string | null;
    role: 'employee' | 'employer';
    createdAt?: Date;
    updatedAt?: Date;
}
export type UserCreation = Optional<UserAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;
export declare class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
    id: string;
    email: string;
    name: string;
    password: string;
    phone: string | null;
    role: 'employee' | 'employer';
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
//# sourceMappingURL=User.d.ts.map