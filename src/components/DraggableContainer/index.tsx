import {
  Children,
  MouseEvent,
  PropsWithChildren,
  ReactElement,
  TouchEvent,
  cloneElement,
  useEffect,
  useRef,
  useState
} from 'react';

interface DraggableContainerProps<T> {
  gap?: number;
  onChange: (newValue: Array<T>) => void;
  value: Array<T>;
}
function DraggableContainer<T>({
  children,
  gap = 0,
  onChange,
  value,
  ...props
}: PropsWithChildren<DraggableContainerProps<T>>) {
  const [localValue, setLocalValue] = useState(value || []);

  const draggingRef = useRef(false);
  const startClientXRef = useRef(0);
  const startClientXFromHalfRef = useRef(0);
  const prevIndex = useRef(-1);
  const prevElementRef = useRef<Element | null>(null);
  const transitionDirectionRef = useRef('');
  const endTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleDragStart = (clientX: number, currentTarget: HTMLDivElement) => {
    const { clientWidth } = currentTarget;

    startClientXRef.current = clientX;
    startClientXFromHalfRef.current = clientWidth / 2 - clientX;

    draggingRef.current = true;
  };

  const handleDrag = (clientX: number, currentTarget: HTMLDivElement) => {
    if (!draggingRef.current) return;

    const { offsetParent, offsetLeft: currentOffsetLeft, clientWidth } = currentTarget;

    const currentIndex = Number(currentTarget.getAttribute('data-index') || 0);

    if (!offsetParent) return;

    const { children: offsetParentChildren } = offsetParent;

    Array.from(offsetParentChildren).forEach((element) => {
      const { offsetLeft } = element as HTMLDivElement;

      const startX = offsetLeft - (startClientXFromHalfRef.current + currentOffsetLeft);
      const endX = clientWidth + startX;

      if (startX <= clientX && endX >= clientX) {
        const dataIndex = Number(element.getAttribute('data-index') || 0);

        let nextDirection = '';

        if (prevIndex.current < dataIndex) {
          nextDirection = 'right';
        } else if (prevIndex.current > dataIndex) {
          nextDirection = 'left';
        }

        if (!transitionDirectionRef.current) {
          transitionDirectionRef.current = nextDirection;
        }

        if (currentIndex < dataIndex) {
          transitionDirectionRef.current = 'right';
        } else if (currentIndex > dataIndex) {
          transitionDirectionRef.current = 'left';
        }

        if (nextDirection === 'right' && transitionDirectionRef.current === 'right') {
          element.setAttribute(
            'style',
            `transform: translate3d(-${
              clientWidth + gap
            }px, 0, 0); transition: transform 0.2s; pointer-events: none;`
          );
        } else if (nextDirection === 'right' && transitionDirectionRef.current === 'left') {
          prevElementRef.current?.setAttribute(
            'style',
            'transform: translate3d(0, 0, 0); transition: transform 0.2s; pointer-events: none;'
          );
        } else if (nextDirection === 'left' && transitionDirectionRef.current === 'right') {
          prevElementRef.current?.setAttribute(
            'style',
            'transform: translate3d(0, 0, 0); transition: transform 0.2s; pointer-events: none;'
          );
        } else if (nextDirection === 'left' && transitionDirectionRef.current === 'left') {
          element.setAttribute(
            'style',
            `transform: translate3d(${
              clientWidth + gap
            }px, 0, 0); transition: transform 0.2s; pointer-events: none;`
          );
        }

        prevIndex.current = dataIndex;
        prevElementRef.current = element;
      }
    });

    currentTarget.setAttribute(
      'style',
      `transform: translate3d(${clientX - startClientXRef.current}px, 0, 0)`
    );
  };

  const handleDragEnd = (currentTarget: HTMLDivElement) => {
    draggingRef.current = false;

    if (prevIndex.current === -1 || !prevElementRef.current) return;

    const { clientWidth } = prevElementRef.current;

    const currentIndex = Number(currentTarget.getAttribute('data-index') || 0);

    currentTarget.setAttribute(
      'style',
      `transform: translate3d(${
        (clientWidth + gap) * (prevIndex.current - currentIndex)
      }px, 0, 0); transition: transform 0.2s; pointer-events: none;`
    );

    const { offsetParent } = currentTarget;

    if (!offsetParent) return;

    const newValue = [...(value || [])];
    const dropValue = newValue[currentIndex];

    newValue.splice(currentIndex, 1);
    newValue.splice(prevIndex.current, 0, dropValue);

    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
    }

    endTimerRef.current = setTimeout(() => {
      setLocalValue(newValue);
    }, 200);

    transitionDirectionRef.current = '';
  };

  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX } = event;

    handleDragStart(clientX, event.currentTarget);
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const { clientX } = event;

    handleDrag(clientX, event.currentTarget);
  };

  const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => handleDragEnd(event.currentTarget);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const { clientX } = event.touches[0];

    handleDragStart(clientX, event.currentTarget);
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    const { clientX } = event.touches[0];

    handleDrag(clientX, event.currentTarget);
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => handleDragEnd(event.currentTarget);

  useEffect(() => {
    if (!prevElementRef.current || !prevElementRef.current.parentElement) return;

    const { children: offsetParentChildren } = prevElementRef.current.parentElement;

    Array.from(offsetParentChildren).forEach((element) => {
      element.removeAttribute('style');
    });

    if (typeof onChange === 'function') {
      onChange(localValue);
    }
  }, [onChange, localValue]);

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap,
        overflow: 'hidden',
        userSelect: 'none'
      }}
      {...props}
    >
      {Children.map(children, (element, index) =>
        cloneElement(element as ReactElement, {
          index,
          onMouseDown: handleMouseDown,
          onMouseMove: handleMouseMove,
          onMouseUp: handleMouseUp,
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd
        })
      )}
    </div>
  );
}

export default DraggableContainer;
