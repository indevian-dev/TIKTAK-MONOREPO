// tiktak SHARED TYPE SYSTEM

// Domain Entities
// export * from './domain/Domain.types';
export * from './domain/Card.types';
export * from './domain/Category.types';
export * from './domain/Notification.types';
export * from './domain/Role.types';
export * from './domain/Workspace.types';

// Domain Input Schemas (Zod — Option A)
export * from './domain/Card.schemas';
export * from './domain/Category.schemas';
export * from './domain/Content.schemas';
export * from './domain/Jobs.schemas';
export * from './domain/Notification.schemas';
export * from './domain/Support.schemas';
export * from './domain/User.schemas';
export * from './domain/Workspace.schemas';

// Auth Types + Schemas
export * from './auth/Auth.types';

// API Contracts
export * from './api/ApiResponse.types';

// Validation
export * from './validation/Validation.types';

// UI
export * from './ui/Ui.types';

