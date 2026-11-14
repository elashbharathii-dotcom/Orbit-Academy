/**
 * Centralized AAA Input & Pointer Lock Manager for Mars Survival
 */

class MarsInputManager {
  private keys: Record<string, boolean> = {};
  private mouseDeltaX: number = 0;
  private mouseDeltaY: number = 0;
  private pointerLocked: boolean = false;
  private uiBlocking: boolean = false;

  // Single-frame edge triggers (debounced action keys)
  private keyETriggered: boolean = false;
  private keySpaceTriggered: boolean = false;
  private keyVTriggered: boolean = false;
  private keyITriggered: boolean = false;
  private keyEscTriggered: boolean = false;

  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  public destroy() {
    if (!this.isInitialized) return;
    this.isInitialized = false;

    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('pointerlockchange', this.handlePointerLockChange);
  }

  public setUIBlocking(blocking: boolean) {
    this.uiBlocking = blocking;
    if (blocking) {
      // Clear movement keys when entering menus
      this.keys = {};
      this.mouseDeltaX = 0;
      this.mouseDeltaY = 0;
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // If typing inside an input element, do not process
    const activeTag = document.activeElement?.tagName.toLowerCase();
    if (activeTag === 'input' || activeTag === 'textarea') return;

    // Edge triggers on key press
    if (!this.keys[e.code]) {
      if (e.code === 'KeyE') this.keyETriggered = true;
      if (e.code === 'Space') this.keySpaceTriggered = true;
      if (e.code === 'KeyV') this.keyVTriggered = true;
      if (e.code === 'KeyI') this.keyITriggered = true;
      if (e.code === 'Escape') this.keyEscTriggered = true;
    }

    this.keys[e.code] = true;
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.pointerLocked || this.uiBlocking) return;
    this.mouseDeltaX += e.movementX || 0;
    this.mouseDeltaY += e.movementY || 0;
  };

  private handlePointerLockChange = () => {
    this.pointerLocked = !!document.pointerLockElement;
  };

  public requestPointerLock(element: HTMLElement) {
    if (this.uiBlocking) return;
    try {
      element.requestPointerLock();
    } catch {
      // Browser pointer lock rejected or blocked
    }
  }

  public exitPointerLock() {
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  public isLocked(): boolean {
    return this.pointerLocked;
  }

  /**
   * Retrieves and resets mouse movement delta for the current frame
   */
  public consumeMouseDelta(): { deltaX: number; deltaY: number } {
    const dx = this.mouseDeltaX;
    const dy = this.mouseDeltaY;
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return { deltaX: dx, deltaY: dy };
  }

  /**
   * Reads raw movement axes with normalized diagonal speed
   */
  public getMovementAxes(): { moveForward: number; moveRight: number; sprint: boolean } {
    if (this.uiBlocking) {
      return { moveForward: 0, moveRight: 0, sprint: false };
    }

    let forward = 0;
    let right = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) forward += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) forward -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) right += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) right -= 1;

    // Normalize diagonal inputs so moving diagonal is not faster
    if (forward !== 0 && right !== 0) {
      const invLen = 1 / Math.SQRT2;
      forward *= invLen;
      right *= invLen;
    }

    const sprint = !!this.keys['ShiftLeft'];
    return { moveForward: forward, moveRight: right, sprint };
  }

  public consumeE(): boolean {
    const val = this.keyETriggered;
    this.keyETriggered = false;
    return val;
  }

  public consumeSpace(): boolean {
    const val = this.keySpaceTriggered;
    this.keySpaceTriggered = false;
    return val;
  }

  public consumeV(): boolean {
    const val = this.keyVTriggered;
    this.keyVTriggered = false;
    return val;
  }

  public consumeI(): boolean {
    const val = this.keyITriggered;
    this.keyITriggered = false;
    return val;
  }

  public consumeEsc(): boolean {
    const val = this.keyEscTriggered;
    this.keyEscTriggered = false;
    return val;
  }
}

export const inputManager = new MarsInputManager();
