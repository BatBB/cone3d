const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())

app.use(bodyParser.json())

app.post('/calc-cone', (req, res) => {
  const { height, radius, segments } = req.body

  const triangulation = getTriangulationCone(height, radius, segments)

  res.json(triangulation)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

function getTriangulationCone(height, radius, segments) {
  const triangulation = []
  const vertexA = {
    x: 0,
    y: 0,
    z: height,
  }

  for (let i = 0; i < segments; i++) {
    const angle1 = (2 * Math.PI * i) / segments
    const nextI = i === segments - 1 ? 0 : Math.PI * (i + 1)
    const angle2 = (2 * nextI) / segments
    const p1 = {
      x: radius * Math.cos(angle1),
      y: radius * Math.sin(angle1),
      z: 0,
    }
    const p2 = {
      x: radius * Math.cos(angle2),
      y: radius * Math.sin(angle2),
      z: 0,
    }

    triangulation.push({
      vertexA,
      p1,
      p2,
    })
  }
  return triangulation
}
