import { apiClient } from "../../../services/api/client";
import { ENDPOINTS } from "../../../services/api/endpoints";
import { BOOKS, type BookDetail } from "../../../mocks/books.mock";

/** FR-04 (book management, read side). */
export async function listBooks(): Promise<BookDetail[]> {
  try {
    return await apiClient.get<BookDetail[]>(ENDPOINTS.books, { auth: false });
  } catch {
    return BOOKS;
  }
}

export async function getBook(id: string): Promise<BookDetail | undefined> {
  try {
    return await apiClient.get<BookDetail>(ENDPOINTS.book(id), { auth: false });
  } catch {
    return BOOKS.find((book) => book.id === id);
  }
}
