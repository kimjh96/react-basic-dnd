import { useState } from 'react';

import { Flexbox } from '@cocstorage/ui';
import DraggableContainer from '@components/DraggableContainer';
import DraggableItem from '@components/DraggableItem';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Example'
};

export default meta;
type Story = StoryObj;

function DefaultWithHooks() {
  const [value, setValue] = useState<number[]>([1, 2, 3, 4, 5]);

  const handleChange = (newValue: number[]) => setValue(newValue);

  return (
    <DraggableContainer gap={8} onChange={handleChange} value={value}>
      {value.map((item) => (
        <DraggableItem key={`draggable-item-${item}`}>
          <Flexbox
            alignment="center"
            justifyContent="center"
            customStyle={{
              width: 100,
              height: 100,
              border: '1px solid'
            }}
          >
            ITEM{item}
          </Flexbox>
        </DraggableItem>
      ))}
    </DraggableContainer>
  );
}

export const Default: Story = {
  render: (args) => <DefaultWithHooks {...args} />
};
