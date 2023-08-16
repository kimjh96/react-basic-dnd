import { HTMLAttributes, MouseEvent, PropsWithChildren } from 'react';

interface DraggableItemProps extends HTMLAttributes<HTMLDivElement> {
  index?: number;
}

function DraggableItem({
  children,
  index = 0,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  ...props
}: PropsWithChildren<DraggableItemProps>) {
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => event.preventDefault();

  return (
    <div
      {...props}
      data-index={index}
      onContextMenu={handleContextMenu}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="presentation"
    >
      {children}
    </div>
  );
}

export default DraggableItem;
