import Config from 'src/config';

export function validateSds(result: any) {
  return result.code === 0;
}

export function mapSds(response: any) {
  if (!response || typeof response !== 'object') {
    return response;
  }

  const result = response.result !== undefined ? response.result : response;

  if (!result || typeof result !== 'object') {
    return result;
  }

  const { cols, rows } = result;
  if (!cols) {
    return rows || result;
  }

  const keys = Object.keys(cols);
  const mapped_data: any[] = [];

  result.rows.forEach((row: any) => {
    const values: any = Object.values(row);
    const mapped = values.reduce(
      (a: any, it: any, index: number) => ({ ...a, [keys[index]]: it }),
      {},
    );
    mapped_data.push(mapped);
  });

  return mapped_data;
}

export function sdsWrapper(api: string): string {
  return Config.sds_base_url + api;
}

export async function fetchSds<T>(
  api: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(sdsWrapper(api), {
    keepalive: true,
    ...options,
  });

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!response.ok) {
    const error: any = new Error('An error occurred while fetching the data.');
    // Attach extra info to the error object.
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }

  const result = await response.json();

  if (validateSds(result)) {
    const parsed = mapSds(result) as T; // Assuming mapSds returns the correct type
    return parsed;
  } else {
    throw new Error(result.error!);
  }
}
