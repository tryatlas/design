/**
 * The data shapes the standards-era components take as props. They mirror the
 * server's API types (`apps/web/src/lib/api.ts`) field for field, so a screen
 * passes its rows straight through.
 */
export type Role = "admin" | "product_owner" | "developer" | "member";
export type Organisation = {
    id: string;
    name: string;
    slug: string;
    /** Two-letter mark shown when there is no logo. */
    initials: string;
    memberCount: number;
    /** Your role in this org; decides what the sidebar offers. */
    role: Role;
};
export type SessionStatus = "live" | "done" | "failed" | "queued";
/** The palette's eight hues plus `grey`. Identity, not status. */
export type LabelTone = "grey" | "red" | "orange" | "yellow" | "green" | "cyan" | "blue" | "purple" | "pink";
export type SessionLabel = {
    name: string;
    tone: LabelTone;
};
export type SessionPriority = "none" | "low" | "medium" | "high" | "urgent";
export type Session = {
    id: string;
    ref: string;
    title: string;
    agent: string;
    model: string;
    branch: string;
    project: string;
    author: string;
    authorInitials: string;
    status: SessionStatus;
    tokens: number;
    added: number;
    removed: number;
    startedAt: string;
    durationMinutes: number;
    commentCount: number;
    labels: Array<SessionLabel>;
    priority: SessionPriority;
};
export type TimelineEntryKind = "prompt" | "thinking" | "tool_call" | "response" | "checkpoint";
export type TimelineEntry = {
    id: string;
    kind: TimelineEntryKind;
    title: string;
    detail?: string;
    at: string;
    toolStatus?: "ok" | "error" | "running";
};
//# sourceMappingURL=types.d.ts.map