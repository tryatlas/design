/**
 * CommsView: the one presentational shape every team-chat block renders.
 *
 * Team chat was drawn three times with rules that disagreed (grouping, DM
 * titles, badge caps, webhook authors): desktop's comms panel from its
 * hand-mirrored wire copy, web's `/chat` from the server's contracts package, and the old
 * standards mock. Each app now writes an adapter onto these types and renders
 * the package's blocks, so the rules live once, in `comms-view-helpers.ts`.
 * Nothing here imports either side's contract types; this file is the
 * contract. People are `PersonRef`, the session view's person type.
 *
 * All times are epoch milliseconds, as the chat wire already is.
 *
 * Message text, attachments and session or code references are slots on the
 * blocks, not fields here: each app renders its own markdown, mention chips
 * and media. `body` stays on the message as the plain source, for a copy or
 * a one-line preview.
 *
 * Where each wire field lands, for adapter authors:
 *
 * | Wire (web contracts, desktop `types.ts`)                           | CommsView                                               |
 * | ------------------------------------------------------------------ | ------------------------------------------------------- |
 * | `ChatConversation.kind` `channel` / `group_dm` / `dm`              | `CommsConversationRowView.kind` `channel` / `group` / `dm` |
 * | `ChatConversation.name`, or `conversationTitle(...)` for DMs       | `CommsConversationRowView.title`                        |
 * | `ChatConversation.visibility` `"private"`                          | `CommsConversationRowView.private`                      |
 * | `ChatConversation.archived_at != null`                             | `CommsConversationRowView.archived`                     |
 * | `ChatReadState.unread` / `mentions`                                | `CommsConversationRowView.unread` / `mentions`          |
 * | `ChatReadState.last_read_seq`                                      | `transcriptRows(..., { lastReadSeq })`                  |
 * | the DM's other member, and whether they are in the presence set    | `CommsConversationRowView.counterpart` (`online`)       |
 * | `ChatMessage.id` / `conv_id` / `seq` / `body`                      | `CommsMessageView.id` / `convId` / `seq` / `body`       |
 * | `ChatMessage.created_at`                                           | `CommsMessageView.at`                                   |
 * | `ChatMessage.edited_at`                                            | `CommsMessageView.editedAt`                             |
 * | `author_kind` `"user"` (or absent) + the member for `author_id`    | `CommsAuthor` `person` (`id` = `author_id`)             |
 * | `author_kind` `"webhook"` + `author_name` / `author_via` / `author_avatar_hash` | `CommsAuthor` `integration` (`name`, `via`, `image`) |
 * | `reply_to_id` + the app's lookup of that id                        | `CommsMessageView.replyTo` (`state` `loaded` / `deleted` / `missing`) |
 * | reaction rows `{ message_id, user_id, emoji }`                     | `reactionChips(rows, me)` → `CommsMessageView.reactions` |
 * | the conversation's pinned ids                                      | `CommsMessageView.pinned`                               |
 * | desktop `deleted` (a tombstone kept for its replies)               | `CommsMessageView.deleted`                              |
 * | desktop `status` `sending` / `sent` / `failed`                     | `CommsMessageView.send`                                 |
 * | `ChatCall.id` / `seq` / `started_at`                               | `CommsCallMarker.id` / `seq` / `at`                     |
 * | `attachments`, `code_refs`, `artifact_refs`                        | `CommsMessageRow`'s `attachments` / `references` slots  |
 */
export {};
//# sourceMappingURL=comms-view.js.map