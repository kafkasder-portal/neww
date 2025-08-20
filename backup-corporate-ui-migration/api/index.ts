// =====================================================
// API Exports
// =====================================================

export { meetingsApi } from './meetings';
export { messagesApi } from './messages';
export { tasksApi } from './tasks';

// Re-export types for convenience
export type {
  Meeting,
  MeetingAttendee,
  MeetingAgenda,
  MeetingMinutes,
  MeetingActionItem,
  MeetingNotification,
  Conversation,
  ConversationParticipant,
  InternalMessage,
  MessageReaction,
  MessageNotification,
  Task,
  TaskComment,
  TaskAttachment,
  TaskNotification,
  TaskActivity,
  TaskStats,
  CreateMeetingData,
  CreateTaskData,
  CreateConversationData,
  SendMessageData
} from '../types/collaboration';