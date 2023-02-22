import { useState, useRef } from 'react'
import { Stage, Layer, Line, Circle } from 'react-konva/lib/ReactKonvaCore'

const dotMatrix = new Array(9).fill(null).map((_, y) =>
  new Array(9).fill(null).map((_, x) => {
    return {
      y,
      x,
      radius: 10,
      color: '#ddd'
    }
  })
)

function App() {
  const [dots, setDots] = useState(dotMatrix)
  const [points, setPoints] = useState([])
  const [drawMode, setDrawMode] = useState('dots')
  const inputRef = useRef(null)

  function addDot(x, y) {
    setDots((prev) => {
      const dotIndex = prev[y].findIndex((item) => item.x == x)
      prev[y][dotIndex].color = prev[y][dotIndex].color === '#ddd' ? '#7232d2' : '#ddd'
      return [...prev]
    })
  }

  function drawLine(x, y, color) {
    if (color === '#ddd') return
    setPoints((prev) => [...prev, [x, y]])
  }

  function generate() {
    const search = dots.flat().filter((item) => item.color === '#7232d2')
    const level = search.map(({ y, x }) => ({ dot: [x, y], join: [] }))
    const temp = level.map((item) => {
      const [x, y] = item.dot
      points.map((point, index) => {
        if (point[0] === x && point[1] === y) {
          const subIndexes = [index - 1, index + 1]
            .filter((num) => num >= 0 && num < points.length)
            .map((num) =>
              num >= level.length
                ? points.findIndex(([x, y]) => x === points[num][0] && y === points[num][1])
                : num
            )

          item.id ??= index
          item.dot = point
          item.join.push(...subIndexes)
        }
      })
    })

    const output = {
      id: Number(inputRef.current.value) ?? 0,
      points: level.sort((a, b) => a.id - b.id).map(({ dot, join }) => ({ dot, join }))
    }
    // console.log('level:', level)
    console.log('points:', points)
    console.log('output:', output)
  }

  function clear() {
    setDots(dotMatrix.map((row) => row.map((item) => ({ ...item, color: '#ddd' }))))
    setPoints([])
    setDrawMode('dots')
  }

  return (
    <>
      <header>
        <label>
          Level: <input ref={inputRef} type="text" defaultValue="0" />
        </label>
      </header>
      <main>
        <div className="canvas">
          <Stage width={320} height={320}>
            <Layer>
              {dots.map((row) =>
                row.map(({ y, x, radius, color }) => {
                  return (
                    <Circle
                      key={`${x}:${y}`}
                      x={x * 35 + 15}
                      y={y * 35 + 15}
                      radius={radius}
                      color={color}
                      fill={color}
                      onMouseDown={
                        drawMode === 'dots' ? () => addDot(x, y) : () => drawLine(x, y, color)
                      }
                    />
                  )
                })
              )}
              <Line
                points={points.flat().map((point) => point * 35 + 15)}
                stroke="#7232d240"
                strokeWidth={10}
                lineCap="round"
                lineJoin="round"
              />
            </Layer>
          </Stage>
        </div>
        <div className="dashboard">
          <div className="buttons">
            <button className="generate-btn" onClick={generate}>
              generate
            </button>
            <button className="clear-btn" onClick={clear}>
              clear
            </button>
          </div>
          <div className="switch-draw">
            <button
              className={`dm-dots-btn ${drawMode === 'dots' ? 'active' : null}`}
              onClick={() => setDrawMode('dots')}>
              ●
            </button>
            <button
              className={`dm-line-btn ${drawMode === 'line' ? 'active' : null}`}
              onClick={() => setDrawMode('line')}>
              <svg
                fill="#000000"
                xmlns="http://www.w3.org/2000/svg"
                width="24px"
                height="24px"
                viewBox="0 0 92.777 92.777">
                <path d="M69.116,14.372c-0.431-0.43-1.127-0.43-1.557,0L3.745,78.188c-0.43,0.431-0.43,1.127,0,1.557l12.711,12.711c0.43,0.43,1.126,0.43,1.557,0L81.827,28.64c0.43-0.43,0.431-1.126,0-1.557L69.116,14.372z M62.242,40.443l-6.484-6.485l11.803-11.803l6.485,6.485L62.242,40.443z" />
                <polygon points="58.261,9.85 60.135,10.712 59.272,8.838 60.135,6.965 58.261,7.826 56.388,6.965 57.248,8.838 56.388,10.712" />
                <polygon points="89.355,18.413 87.481,19.274 85.608,18.413 86.47,20.286 85.608,22.159 87.481,21.298 89.355,22.159 88.493,20.286" />
                <polygon points="81.485,7.386 86.28,9.59 84.076,4.795 86.28,0 81.485,2.204 76.689,0 78.895,4.795 76.689,9.591" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
