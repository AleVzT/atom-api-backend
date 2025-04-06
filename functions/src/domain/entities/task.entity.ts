export interface TaskProps {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export class Task {
  constructor(private props: TaskProps) {}

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get completed() {
    return this.props.completed;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  toJSON() {
    return {
      id: this.props.id,
      title: this.props.title,
      description: this.props.description,
      completed: this.props.completed,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      userId: this.props.userId,
    };
  }

   get userId(): string {
    return this.props.userId;
  }
}
