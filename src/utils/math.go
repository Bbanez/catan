package utils

import (
	"math"
)

func FastSqrt32(x float32) float32 {
	// Handle special cases
	if x <= 0 {
		return 0
	}
	// Get the binary representation
	bits := math.Float32bits(x)
	// Extract exponent and shift it
	expo := bits >> 23
	expo -= 127 // bias
	expo >>= 1  // divide by 2
	expo += 127 // add bias back
	// Build approximation
	bits = (expo << 23) | (bits & 0x007FFFFF)
	guess := math.Float32frombits(bits)
	// One iteration of Newton's method
	// can add more iterations for better precision
	guess = guess * (1.5 - 0.5*x*guess*guess)
	return guess
}

// / Quake 3 fast inverse square root
func FastFastInvSqrt32(x float32) float32 {
	const threehalfs = 1.5
	x2 := x * 0.5
	bits := math.Float32bits(x)
	// What the hex is this?
	bits = 0x5f3759df - (bits >> 1)
	y := math.Float32frombits(bits)
	// One Newton iteration
	y = y * (threehalfs - (x2 * y * y))
	return y
}
func FastFastSqrt32(x float32) float32 {
	return x * FastFastInvSqrt32(x)
}

func AbsF32(x float32) float32 {
	return float32(math.Float32bits(x) &^ (1 << 31))
}

func DistanceSquared(p1 *Point, p2 *Point) float32 {
	x := AbsF32(p1.X - p2.X)
	y := AbsF32(p1.Y - p2.Y)
	return x*x + y*y
}

func ArePointsNear(p1 *Point, p2 *Point, delta float32) bool {
	d := DistanceSquared(p1, p2)
	return d <= delta*delta
}

func GetAngle(p1, p2 *Point) float32 {
	dx := p2.X - p1.X
	dy := p2.Y - p1.Y
	return float32(math.Atan2(float64(dy), float64(dx)))
}

func RadToDeg(rad float32) float32 {
	return rad * 180.0 / math.Pi
}

func DegToRad(deg float32) float32 {
	return deg * math.Pi / 180.0
}

func XYToIdx(x int32, y int32, width int32) int32 {
	return y*width + x
}

func IdxToXY(idx int32, width int32) Tuple[int32] {
	x := idx % width
	y := (idx - x) / width
	return Tuple[int32]{x, y}
}

func Remap(x, inMin, inMax, outMin, outMax float32) float32 {
	if x < inMin {
		return outMin
	} else if x > inMax {
		return outMax
	}
	return (x-inMin)*(outMax-outMin)/(inMax-inMin) + outMin
}

func Clamp(x, min, max float32) float32 {
	if x < min {
		return min
	} else if x > max {
		return max
	}
	return x
}
