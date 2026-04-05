import NotesPageClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

interface NotesPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

async function Notes({ searchParams }: NotesPageProps) {
  const { page, search } = await searchParams;
  const currentPage = Number(page ?? "1");

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page: currentPage, perPage: 12, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesPageClient />
    </HydrationBoundary>
  );
}

export default Notes;