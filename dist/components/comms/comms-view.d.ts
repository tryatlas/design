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
import type { PersonRef } from "../session/session-view.ts";
/** What a conversation is. Web and desktop's `group_dm` is `group`. */
export type CommsConversationKind = "channel" | "group" | "dm";
/** One row of the conversation list. */
export interface CommsConversationRowView {
    id: string;
    kind: CommsConversationKind;
    /** The channel's name, or the DM's title from `conversationTitle`. */
    title: string;
    /** A private channel: drawn with a lock rather than a hash. */
    private?: boolean;
    /** Archived: read-only, drawn in the disabled ink. */
    archived?: boolean;
    /** Server-held; never counted locally. */
    unread: number;
    /** Server-held; a mention outranks a plain unread count. */
    mentions: number;
    /**
     * A 1:1 DM's other person. `online` undefined draws no presence dot: for a
     * member the app cannot resolve, `false` would assert "offline" about
     * someone it cannot even name.
     */
    counterpart?: PersonRef & {
        online?: boolean;
    };
}
/**
 * Who wrote a message: a member, or an integration posting through an
 * incoming webhook.
 *
 * An integration is always badged and never gets a person card or a presence
 * dot (ADR-0020's impersonation guarantee): a webhook can post under any
 * `username`, so when it used one that is not its own name, `via` carries the
 * webhook's real name and the row says "via X" beside the badge.
 */
export type CommsAuthor = {
    kind: "person";
    id: string;
    person: PersonRef;
    online?: boolean;
} | {
    kind: "integration";
    /** The webhook's id (`whk_…`), never a member id. */
    id: string;
    /** The name the message was posted under. */
    name: string;
    /** The webhook's own name, when the post used a different one. */
    via?: string;
    /** The webhook's picture, when it has one. */
    image?: string;
};
/** One emoji's chip under a message. Derived by `reactionChips`, never stored. */
export interface CommsReaction {
    emoji: string;
    /** `userIds.length`. */
    count: number;
    /** The current user is among `userIds`: a click sends `on = !mine`. */
    mine: boolean;
    userIds: string[];
}
/**
 * The message a reply quotes. `missing` is paged out rather than gone: the
 * quote still jumps, and the jump pages the parent in. `deleted` is gone, and
 * the quote says so rather than pointing at nothing.
 */
export interface CommsReplyRef {
    id: string;
    /** The parent's author as one line (an integration as "CI · via Deploy (app)"). */
    authorName?: string;
    /** The parent's text, flattened to one line by the app. */
    preview?: string;
    state: "loaded" | "deleted" | "missing";
}
/**
 * Two rungs and a failure. Nothing on the wire reports that a message reached
 * a device, so there is no "delivered".
 */
export type CommsSendState = "sending" | "sent" | "failed";
export interface CommsMessageView {
    id: string;
    convId: string;
    /** The conversation's own order; rows sort by it, not by time. */
    seq: number;
    author: CommsAuthor;
    /** The plain source text, for copying and previews. The row renders the `body` slot. */
    body: string;
    /** Epoch ms. */
    at: number;
    editedAt?: number | null;
    replyTo?: CommsReplyRef | null;
    reactions: CommsReaction[];
    /** Pins are shared: anyone's pin is everyone's. */
    pinned?: boolean;
    /** A tombstone, kept so a reply pointing at it still renders. */
    deleted?: boolean;
    /** Absent for a message read from history, which was sent. */
    send?: CommsSendState;
}
/** A call, as a marker in the transcript at its place in `seq` order. */
export interface CommsCallMarker {
    id: string;
    seq: number;
    /** When it started, epoch ms. */
    at: number;
}
/**
 * One row of the transcript, top to bottom, from `transcriptRows`. `head`
 * opens a run: the avatar and the author line. A continuation shows its time
 * in the gutter on hover instead.
 */
export type CommsTranscriptRow = {
    kind: "day";
    key: string;
    at: number;
} | {
    kind: "unread";
    key: string;
} | {
    kind: "message";
    key: string;
    message: CommsMessageView;
    head: boolean;
} | {
    kind: "call";
    key: string;
    call: CommsCallMarker;
};
//# sourceMappingURL=comms-view.d.ts.map