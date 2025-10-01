import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

export interface JobAttributes {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  type?: string | null;
  category?: string | null;
  isRemote?: boolean | null;
  description?: string | null;
  salary?: {
    min: number;
    max: number;
    currency: string;
  } | null;
  experience?: {
    min: number;
    max: number;
  } | null;
  skills?: string[] | null;
  requirements?: string[] | null;
  postedDate?: string | null;
  applicationDeadline?: string | null;
  companyLogo?: string | null;
}

export type JobCreation = Optional<JobAttributes, 'id'>;

export class Job extends Model<JobAttributes, JobCreation> implements JobAttributes {
  declare id: string;
  declare title: string;
  declare company: string;
  declare location: string | null;
  declare type: string | null;
  declare category: string | null;
  declare isRemote: boolean | null;
  declare description: string | null;
  declare salary: { min: number; max: number; currency: string } | null;
  declare experience: { min: number; max: number } | null;
  declare skills: string[] | null;
  declare requirements: string[] | null;
  declare postedDate: string | null;
  declare applicationDeadline: string | null;
  declare companyLogo: string | null;
}

Job.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  isRemote: { type: DataTypes.BOOLEAN },
  description: { type: DataTypes.TEXT },
  salary: { type: DataTypes.JSON },
  experience: { type: DataTypes.JSON },
  skills: { type: DataTypes.JSON },
  requirements: { type: DataTypes.JSON },
  postedDate: { type: DataTypes.STRING },
  applicationDeadline: { type: DataTypes.STRING },
  companyLogo: { type: DataTypes.STRING },
}, {
  sequelize,
  tableName: 'jobs',
});
