package utils

import (
	"math/rand"
	"time"
)

type FindQuery[Item any] func(item *Item) bool
type MapTransform[T any, O any] func(item *T) *O

func FindRef[T any](items []*T, query FindQuery[T]) Option[*T] {
	for i := 0; i < len(items); i++ {
		item := items[i]
		if query(item) {
			return Some(item)
		}
	}
	return None[*T]()
}
func Find[T any](items []T, query FindQuery[T]) Option[T] {
	for i := 0; i < len(items); i++ {
		item := items[i]
		if query(&item) {
			return Some(item)
		}
	}
	return None[T]()
}

func FilterRef[T any](items []*T, query FindQuery[T]) []*T {
	result := []*T{}
	for i := 0; i < len(items); i++ {
		item := items[i]
		if query(item) {
			result = append(result, item)
		}
	}
	return result
}
func Filter[T any](items []T, query FindQuery[T]) []T {
	result := []T{}
	for i := 0; i < len(items); i++ {
		item := items[i]
		if query(&item) {
			result = append(result, item)
		}
	}
	return result
}

func MapRef[T any, O any](items []*T, transform MapTransform[T, O]) []*O {
	result := []*O{}
	for i := 0; i < len(items); i++ {
		item := items[i]
		result = append(result, transform(item))
	}
	return result
}
func Map[T any, O any](items []T, transform MapTransform[T, O]) []O {
	result := []O{}
	for i := 0; i < len(items); i++ {
		item := items[i]
		outputItem := transform(&item)
		result = append(result, *outputItem)
	}
	return result
}

func CloneArray[T any](items []*T) []T {
	var result []T
	for _, item := range items {
		result = append(result, *item)
	}
	return result
}

func Contains[T comparable](items []T, item T) bool {
	for _, i := range items {
		if i == item {
			return true
		}
	}
	return false
}

func UintArray(from uint32, to uint32) []uint32 {
	result := []uint32{}
	for i := from; i <= to; i++ {
		result = append(result, i)
	}
	return result
}

func NewArrayWithValue[T any](value T, size uint32) []T {
	var result []T
	for i := uint32(0); i < size; i++ {
		result = append(result, value)
	}
	return result
}

// This function will mutate original array
func Shuffle[T any](items []T) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	r.Shuffle(len(items), func(i, j int) {
		a := items[i]
		b := items[j]
		items[i], items[j] = b, a
	})
}

// This function will mutate original array
func ShuffleRef[T any](items []*T) {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	r.Shuffle(len(items), func(i, j int) {
		a := *items[i]
		b := *items[j]
		items[i], items[j] = &b, &a
	})
}
