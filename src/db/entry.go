package db

type DBEntry interface {
	GetId() string
	SetId(string)
	GetCreatedAt() uint64
	SetCreatedAt(uint64)
	GetUpdatedAt() uint64
	SetUpdatedAt(uint64)
}
