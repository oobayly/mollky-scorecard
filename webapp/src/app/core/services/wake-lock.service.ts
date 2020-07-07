import { Injectable } from "@angular/core";

export type WakeLockType = "screen";

interface WakeLock {
  request(resource: WakeLockType): Promise<WakeLockSentinel>;
}

interface WakeLockSentinel extends EventTarget {
  readonly type: WakeLockType;

  release(): Promise<void>;

  onrelease: (this: WakeLockSentinel, e: Event) => void;
}

@Injectable({
  providedIn: "root",
})
export class WakeLockService {
  private _isSupported: boolean;

  private wakeLock: WakeLockSentinel;

  public get isLocked(): boolean {
    return !!this.wakeLock;
  }

  public get isSupported(): boolean {
    return this._isSupported;
  }

  public constructor() {
    this._isSupported = "wakeLock" in navigator;
  }

  public async releaseLock(): Promise<void> {
    if (!this.wakeLock) {
      return;
    }

    await this.wakeLock.release();

    this.wakeLock = null;
  }

  public async requestLock(type: WakeLockType = "screen"): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    if (this.wakeLock) {
      await this.releaseLock();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wl = (navigator as any).wakeLock as WakeLock;

    this.wakeLock = await wl.request(type);

    return true;
  }
}
