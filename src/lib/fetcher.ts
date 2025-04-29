// Centralized fetch utility for robust error handling
export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    let errorText: string;
    try {
      errorText = await res.text();
    } catch {
      errorText = 'Unknown error';
    }
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }
  return res.json();
}
