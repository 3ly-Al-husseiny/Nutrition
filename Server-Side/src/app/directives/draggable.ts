import { Directive, ElementRef, HostListener, Renderer2, OnDestroy, Output, EventEmitter } from '@angular/core';

/**
 * ==========================================================================
 * DRAGGABLE DIRECTIVE
 * ==========================================================================
 * A structural directive that enables Mouse and Touch dragging for any DOM element.
 * 
 * Features:
 * 1. Supports both Mouse and Touch events.
 * 2. Boundary Checking: Prevents elements from being dragged off-screen.
 * 3. Click Distinction: Distinguishes between a "Drag" action and a "Click" action
 *    to ensure clickable elements (buttons/links) inside the draggable container work.
 * 4. Visual Feedback: Updates cursors during interaction.
 */

@Directive({
  selector: '[appDraggable]',
  standalone: true,
})
export class Draggable implements OnDestroy {

  // =============================================
  // 1. OUTPUTS
  // =============================================

  /**
   * Emitted only when a user clicks/taps WITHOUT dragging.
   * Use this instead of (click) to prevent firing clicks at the end of a drag operation.
   */
  @Output() distinctClick = new EventEmitter<void>();


  // =============================================
  // 2. STATE & CONFIGURATION
  // =============================================

  private isDragging = false;
  private hasDragged = false; // Tracks if movement exceeded threshold
  private readonly DRAG_THRESHOLD = 5; // Pixels to move before considering it a "Drag"

  // Coordinates
  private offsetX = 0;
  private offsetY = 0;
  private startX = 0;
  private startY = 0;

  // Event Listener Cleanup Functions
  private unbindMouseMove!: () => void;
  private unbindMouseUp!: () => void;
  private unbindTouchMove!: () => void;
  private unbindTouchEnd!: () => void;


  // =============================================
  // 3. INITIALIZATION
  // =============================================

  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.element = el.nativeElement;

    // Ensure element creates a positioning context relative to the viewport
    this.renderer.setStyle(this.element, 'position', 'fixed');

    // Note: We do NOT set 'cursor: grab' here to allow CSS to control the default state
    // (e.g., pointer for buttons). We only override it during active dragging.
  }

  private element: HTMLElement;


  // =============================================
  // 4. EVENT LISTENERS (Start Interaction)
  // =============================================

  /**
   * Handles Mouse Down (Start of interaction).
   */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    // Only accept Left Click (button 0)
    if (event.button !== 0) return;

    event.preventDefault(); // Prevent text selection
    this.initializeDrag(event.clientX, event.clientY);

    // Bind Global Listeners (Window level to catch fast movements outside element)
    this.unbindMouseMove = this.renderer.listen('window', 'mousemove', this.onMouseMove.bind(this));
    this.unbindMouseUp = this.renderer.listen('window', 'mouseup', this.onMouseUp.bind(this));
  }

  /**
   * Handles Touch Start.
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    // Prevent scrolling while dragging the element
    // Note: 'passive: false' might be needed in some config, but preventing default here usually works
    // event.preventDefault(); 

    this.initializeDrag(touch.clientX, touch.clientY);

    this.unbindTouchMove = this.renderer.listen('window', 'touchmove', this.onTouchMove.bind(this));
    this.unbindTouchEnd = this.renderer.listen('window', 'touchend', this.onTouchEnd.bind(this));
  }

  /**
   * Handles Window Resize.
   * Repositions the element to ensure it stays within bounds if the window shrinks.
   */
  @HostListener('window:resize')
  onResize(): void {
    if (this.element.style.left) {
      const x = parseFloat(this.element.style.left || '0');
      const y = parseFloat(this.element.style.top || '0');
      this.setPosition(x, y); // Recalculate bounds
    }
  }


  // =============================================
  // 5. CORE LOGIC
  // =============================================

  /**
   * Common initialization logic for both Mouse and Touch.
   */
  private initializeDrag(clientX: number, clientY: number): void {
    this.hasDragged = false;
    this.startX = clientX;
    this.startY = clientY;

    // Visual Feedback: Immediate "Grabbing" cursor
    this.renderer.setStyle(this.element, 'cursor', 'grabbing');
  }

  /**
   * Logic to initiate the actual movement.
   * Called only after the threshold is passed or immediately on move.
   */
  private startDrag(clientX: number, clientY: number): void {
    this.isDragging = true;

    // Performance Optimization: Hint the browser about changes
    this.renderer.setStyle(this.element, 'will-change', 'transform, left, top');

    const rect = this.element.getBoundingClientRect();

    // Calculate offset relative to the element's current position
    // If it's the first drag, we calculate based on rect vs client coordinates.
    if (!this.element.style.left || !this.element.style.top) {
      this.offsetX = clientX - rect.left;
      this.offsetY = clientY - rect.top;

      // Normalize styles from bottom/right to top/left
      this.renderer.setStyle(this.element, 'right', 'auto');
      this.renderer.setStyle(this.element, 'bottom', 'auto');
      this.renderer.setStyle(this.element, 'left', `${rect.left}px`);
      this.renderer.setStyle(this.element, 'top', `${rect.top}px`);
    } else {
      this.offsetX = clientX - parseFloat(this.element.style.left || '0');
      this.offsetY = clientY - parseFloat(this.element.style.top || '0');
    }
  }

  /**
   * Handles the movement calculation.
   */
  private onDrag(clientX: number, clientY: number): void {
    // 1. Threshold Check: Only start dragging if moved > X pixels
    if (!this.hasDragged) {
      const deltaX = Math.abs(clientX - this.startX);
      const deltaY = Math.abs(clientY - this.startY);
      if (deltaX > this.DRAG_THRESHOLD || deltaY > this.DRAG_THRESHOLD) {
        this.hasDragged = true;
      }
    }

    // 2. Initialize Drag State if confirmed
    if (!this.isDragging && this.hasDragged) {
      this.startDrag(clientX, clientY);
    }

    // 3. Execute Movement
    if (this.isDragging) {
      let newX = clientX - this.offsetX;
      let newY = clientY - this.offsetY;
      this.setPosition(newX, newY);
    }
  }

  /**
   * Handles the end of interaction (Mouse Up / Touch End).
   */
  private stopDrag(): void {
    // If we didn't move enough to drag, treat it as a Click
    if (!this.hasDragged) {
      this.distinctClick.emit();
    }

    // Cleanup Drag State
    if (this.isDragging) {
      this.isDragging = false;
      this.renderer.removeStyle(this.element, 'will-change');
    }

    // Remove cursor override to fall back to CSS defaults
    this.renderer.removeStyle(this.element, 'cursor');

    // Unbind Global Listeners
    if (this.unbindMouseMove) this.unbindMouseMove();
    if (this.unbindMouseUp) this.unbindMouseUp();
    if (this.unbindTouchMove) this.unbindTouchMove();
    if (this.unbindTouchEnd) this.unbindTouchEnd();
  }

  /**
   * Updates element position with Boundary Checking (Viewport).
   */
  private setPosition(x: number, y: number): void {
    const elemRect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Clamp X (Left/Right bounds)
    if (x < 0) x = 0;
    if (x + elemRect.width > viewportWidth) x = viewportWidth - elemRect.width;

    // Clamp Y (Top/Bottom bounds)
    if (y < 0) y = 0;
    if (y + elemRect.height > viewportHeight) y = viewportHeight - elemRect.height;

    this.renderer.setStyle(this.element, 'left', `${x}px`);
    this.renderer.setStyle(this.element, 'top', `${y}px`);
  }


  // =============================================
  // 6. EVENT HANDLER BINDINGS
  // =============================================

  // These bridge the global listeners to the logic methods
  private onMouseMove(event: MouseEvent): void { this.onDrag(event.clientX, event.clientY); }
  private onMouseUp(): void { this.stopDrag(); }

  private onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    if (touch) { this.onDrag(touch.clientX, touch.clientY); }
  }
  private onTouchEnd(): void { this.stopDrag(); }


  // =============================================
  // 7. CLEANUP
  // =============================================

  ngOnDestroy(): void {
    // Ensure all listeners are removed to prevent memory leaks
    if (this.unbindMouseMove) this.unbindMouseMove();
    if (this.unbindMouseUp) this.unbindMouseUp();
    if (this.unbindTouchMove) this.unbindTouchMove();
    if (this.unbindTouchEnd) this.unbindTouchEnd();
  }
}