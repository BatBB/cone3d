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
  const pointB = {
    x: 0,
    y: 0,
    z: -(radius ** 2 / height),
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

    const Ni = {
      x: p1.x - pointB.x,
      y: p1.y - pointB.y,
      z: p1.z - pointB.z,
    }

    const NiMagnitude = Math.sqrt(Ni.x ** 2 + Ni.y ** 2 + Ni.z ** 2)

    const normal = {
      x: Ni.x / NiMagnitude,
      y: Ni.y / NiMagnitude,
      z: Ni.z / NiMagnitude,
    }

    triangulation.push({
      vertexA,
      p1,
      p2,
      normal,
    })
  }
  return triangulation
}
