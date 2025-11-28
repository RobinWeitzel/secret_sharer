/**
 * Compression utilities using the Compression Streams API
 * This helps reduce the size of data before encryption to minimize QR code payload
 */

import { arrayBufferToBase64, base64ToArrayBuffer, combineChunks } from './encoding';

/**
 * Compress a string using gzip
 */
export async function compress(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoded);
      controller.close();
    },
  });

  const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
  const chunks = await readStreamChunks(compressedStream);
  const combined = combineChunks(chunks);

  return arrayBufferToBase64(combined);
}

/**
 * Decompress a gzip-compressed base64 string
 */
export async function decompress(compressedBase64: string): Promise<string> {
  const compressed = base64ToArrayBuffer(compressedBase64);

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(compressed));
      controller.close();
    },
  });

  const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
  const chunks = await readStreamChunks(decompressedStream);
  const combined = combineChunks(chunks);

  return new TextDecoder().decode(combined);
}

/**
 * Read all chunks from a readable stream
 */
async function readStreamChunks(stream: ReadableStream<Uint8Array>): Promise<Uint8Array[]> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return chunks;
}
