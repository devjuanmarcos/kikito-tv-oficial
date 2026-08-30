/**
 * Native DOM event handlers whose React types (DragEventHandler, AnimationEventHandler…)
 * collide with Framer Motion's own props of the same name (motion's `onDrag` reports
 * PointerEvent/MouseEvent/TouchEvent + PanInfo, not a native DragEvent). Spreading raw
 * `ComponentPropsWithoutRef<...>` onto a `motion(Component)`-wrapped element fails to
 * type-check unless these are stripped first — see MotionSafeProps below.
 */
type MotionConflictingProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

/** `T` with the native handlers that collide with Framer Motion's own props omitted. */
export type MotionSafeProps<T> = Omit<T, MotionConflictingProps>;
