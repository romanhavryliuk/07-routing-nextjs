import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "@/lib/api";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onMutate: (id) => {
      setDeletingIds((prev) => [...prev, id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error("Failed to delete note:", error);
    },
    onSettled: (_, __, id) => {
      setDeletingIds((prev) => prev.filter((prevId) => prevId !== id));
    },
  });

  if (!notes || notes.length === 0) {
    return <p>Немає нотаток для відображення.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => {
        const formattedDate = note.updatedAt
          ? `Updated at: ${note.updatedAt}`
          : `Created at: ${note.createdAt}`;

        return (
          <li key={note.id} className={css.listItem}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <div className={css.footerInfo}>
                {note.tag && <span className={css.tag}>{note.tag}</span>}
                <span className={css.date}>{formattedDate}</span>
              </div>

              <div className={css.actions}>
                <Link href={`/notes/${note.id}`} className={css.link}>
                  View details
                </Link>
                <button
                  type="button"
                  className={css.button}
                  disabled={deletingIds.includes(note.id)}
                  onClick={() => removeNote(note.id)}
                >
                  {deletingIds.includes(note.id) ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}