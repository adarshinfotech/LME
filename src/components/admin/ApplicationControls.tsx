"use client";

import { useActionState, useRef, useState } from "react";
import { addNoteAction, assignAction, saveNotesAction, updateStatusAction, type ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { STATUSES, STATUS_LABELS, type ApplicationStatus } from "@/lib/applications/status";
import type { StaffMember } from "@/lib/applications/types";
import { useActionToast } from "./useActionToast";

const panel = "border-b border-line p-5 sm:p-6";
const heading = "eyebrow mb-3 block text-[0.65rem] text-muted";
const select =
  "h-11 w-full appearance-none border border-ink/20 bg-white/70 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 12 8%22><path d=%22M1 1.5 6 6.5l5-5%22 fill=%22none%22 stroke=%22%23111%22 stroke-width=%221.3%22/></svg>')] bg-[length:10px] bg-[right_0.75rem_center] bg-no-repeat px-3 text-sm focus:border-ink focus:outline-none disabled:opacity-60";

export function StatusControl({ id, status }: { id: string; status: ApplicationStatus }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(updateStatusAction, null);
  const [confirming, setConfirming] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  useActionToast(state);

  return (
    <section className={panel} aria-labelledby="status-label">
      <form ref={formRef} action={action}>
        <input type="hidden" name="id" value={id} />
        <label id="status-label" htmlFor="status" className={heading}>
          Status
        </label>
        <select
          ref={selectRef}
          id="status"
          name="status"
          key={status}
          defaultValue={status}
          disabled={pending}
          className={select}
          onChange={(e) => (e.target.value === "REJECTED" ? setConfirming(true) : formRef.current?.requestSubmit())}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </form>
      <Modal
        open={confirming}
        title="Reject this application?"
        onClose={() => {
          setConfirming(false);
          if (selectRef.current) selectRef.current.value = status;
        }}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setConfirming(false);
                if (selectRef.current) selectRef.current.value = status;
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirming(false);
                formRef.current?.requestSubmit();
              }}
            >
              Reject application
            </Button>
          </>
        }
      >
        The applicant will stay in the system and the change is recorded in the activity timeline. You can reopen it later by changing the
        status.
      </Modal>
    </section>
  );
}

export function AssignControl({ id, assignedTo, staff }: { id: string; assignedTo: string | null; staff: StaffMember[] }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(assignAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state);
  return (
    <section className={panel}>
      <form ref={formRef} action={action}>
        <input type="hidden" name="id" value={id} />
        <label htmlFor="assignee" className={heading}>
          Assigned to
        </label>
        <select
          id="assignee"
          name="assignee"
          key={assignedTo ?? ""}
          defaultValue={assignedTo ?? ""}
          disabled={pending}
          className={select}
          onChange={() => formRef.current?.requestSubmit()}
        >
          <option value="">Unassigned</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName}
            </option>
          ))}
        </select>
      </form>
    </section>
  );
}

export function InternalNotes({ id, notes }: { id: string; notes: string | null }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(saveNotesAction, null);
  const [dirty, setDirty] = useState(false);
  useActionToast(state);
  return (
    <section className={panel}>
      <form
        action={async (fd) => {
          await action(fd);
          setDirty(false);
        }}
      >
        <input type="hidden" name="id" value={id} />
        <label htmlFor="notes" className={heading}>
          Internal notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={10000}
          defaultValue={notes ?? ""}
          onChange={() => setDirty(true)}
          placeholder="Summary, qualification notes, next steps…"
          className="w-full resize-y border border-ink/20 bg-white/70 p-3 text-sm leading-relaxed focus:border-ink focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted">{dirty ? "Unsaved changes" : "Visible to the LMI team only"}</span>
          <button
            type="submit"
            disabled={pending || !dirty}
            className="h-9 bg-ink px-4 text-xs uppercase tracking-[0.14em] text-sand disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function NoteComposer({ id }: { id: string }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(addNoteAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(state);
  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await action(fd);
        formRef.current?.reset();
      }}
      className="p-5 sm:p-6"
    >
      <input type="hidden" name="id" value={id} />
      <label htmlFor="note" className={heading}>
        Add to timeline
      </label>
      <textarea
        id="note"
        name="body"
        rows={3}
        required
        maxLength={4000}
        placeholder="Log a call, meeting or next step…"
        className="w-full resize-y border border-ink/20 bg-white/70 p-3 text-sm leading-relaxed focus:border-ink focus:outline-none"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="h-9 bg-ink px-4 text-xs uppercase tracking-[0.14em] text-sand disabled:opacity-40"
        >
          {pending ? "Adding…" : "Add note"}
        </button>
      </div>
    </form>
  );
}
