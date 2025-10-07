package utils

type Option[T any] struct {
	Value     T
	Available bool
}

func Some[T any](value T) Option[T] {
	return Option[T]{
		Value:     value,
		Available: true,
	}
}

func None[T any]() Option[T] {
	return Option[T]{
		Available: false,
	}
}
