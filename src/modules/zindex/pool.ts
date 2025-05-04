export type Region = [number, number]; // [start, end)

export class PoolManager {
  private free: Region[];

  constructor(min: number, max: number) {
    this.free = [[min, max]];
  }

  allocate(count: number): number | null {
    for (let i = 0; i < this.free.length; i++) {
      const [start, end] = this.free[i];
      if (end - start >= count) {
        const allocStart = start;
        const allocEnd = start + count;

        if (allocEnd === end) {
          this.free.splice(i, 1);
        } else {
          this.free[i] = [allocEnd, end];
        }

        return allocStart;
      }
    }
    return null;
  }

  freeRegion(start: number, count: number) {
    const end = start + count;
    this.free.push([start, end]);
    this.merge();
  }

  private merge() {
    this.free.sort((a, b) => a[0] - b[0]);
    const merged: Region[] = [];

    for (const [start, end] of this.free) {
      if (merged.length > 0 && merged[merged.length - 1][1] >= start) {
        merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
      } else {
        merged.push([start, end]);
      }
    }

    this.free = merged;
  }
}
