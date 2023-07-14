export type Assert<T> = (obj: T | null) => void | never;

export const isNothing = (a: any) => a === null || a === undefined;

export const assertNull = (a: unknown, name: string) => {
  if (isNothing(a)) {
    throw new Error(name + ' is null/undefined');
  }
};

export const assertEmptyBuffer = (a: Buffer, name: string) => {
  if (isNothing(a) || (a.toString && a.toString() === '')) {
    throw new Error(name + ' is empty');
  }
};
