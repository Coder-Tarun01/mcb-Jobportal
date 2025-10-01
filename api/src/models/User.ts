import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface UserAttributes {
  id: string;
  email: string;
  name: string;
  password: string;
  phone?: string | null;
  role: 'employee' | 'employer';
  // Profile fields
  professionalTitle?: string | null;
  jobTitle?: string | null;
  languages?: string | null;
  age?: string | null;
  currentSalary?: string | null;
  expectedSalary?: string | null;
  description?: string | null;
  bio?: string | null;
  country?: string | null;
  postcode?: string | null;
  city?: string | null;
  location?: string | null;
  fullAddress?: string | null;
  address?: string | null;
  skills?: string[] | null;
  experience?: string | null;
  education?: string | null;
  companyName?: string | null;
  companyLogo?: string | null;
  companyDescription?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreation = Optional<UserAttributes, 'id' | 'phone' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare name: string;
  declare password: string;
  declare phone: string | null;
  declare role: 'employee' | 'employer';
  // Profile fields
  declare professionalTitle: string | null;
  declare jobTitle: string | null;
  declare languages: string | null;
  declare age: string | null;
  declare currentSalary: string | null;
  declare expectedSalary: string | null;
  declare description: string | null;
  declare bio: string | null;
  declare country: string | null;
  declare postcode: string | null;
  declare city: string | null;
  declare location: string | null;
  declare fullAddress: string | null;
  declare address: string | null;
  declare skills: string[] | null;
  declare experience: string | null;
  declare education: string | null;
  declare companyName: string | null;
  declare companyLogo: string | null;
  declare companyDescription: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => Math.random().toString(36).substr(2, 9) },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'employee' },
  // Profile fields
  professionalTitle: { type: DataTypes.STRING, allowNull: true },
  jobTitle: { type: DataTypes.STRING, allowNull: true },
  languages: { type: DataTypes.STRING, allowNull: true },
  age: { type: DataTypes.STRING, allowNull: true },
  currentSalary: { type: DataTypes.STRING, allowNull: true },
  expectedSalary: { type: DataTypes.STRING, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  country: { type: DataTypes.STRING, allowNull: true },
  postcode: { type: DataTypes.STRING, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  fullAddress: { type: DataTypes.TEXT, allowNull: true },
  address: { type: DataTypes.TEXT, allowNull: true },
  skills: { type: DataTypes.JSON, allowNull: true },
  experience: { type: DataTypes.STRING, allowNull: true },
  education: { type: DataTypes.STRING, allowNull: true },
  companyName: { type: DataTypes.STRING, allowNull: true },
  companyLogo: { type: DataTypes.STRING, allowNull: true },
  companyDescription: { type: DataTypes.TEXT, allowNull: true },
}, {
  sequelize,
  tableName: 'users',
});
