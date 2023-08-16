### Installation

#### npm

```
npm install react-basic-dnd
```

#### yarn

```
yarn add react-basic-dnd
```

#### pnpm

```
pnpm install react-basic-dnd
```

### Usage

```javascript
import { DraggableContainer, DraggableItem } from 'react-basic-dnd';

function App() {
  const [value, setValue] = useState([1, 2]);
  
  const handleChange = () => (newValue) => setValue(newValue);
  
  return (
    <DraggableContainer onChange={handleChange} value={value}>
      {value.map((item) => (
        <DraggableItem key={`item-${item}`}>
          <div
            style={{
              padding: 20,
              border: '1px solid'
            }}
          >
            ITEM {item}
          </div>
        </DraggableItem>
      ))}
    </DraggableContainer>
  )
}

export default App;
```