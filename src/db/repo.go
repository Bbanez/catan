package db

import (
	"sync"
	"time"

	"github.com/bbanez/catan/src/utils"
	"google.golang.org/protobuf/proto"
)

type DBRepo[Entry DBEntry] struct {
	mu             sync.Mutex
	CollectionName string
	Storage        *DBStorage
	Cache          *utils.MemCache[Entry]
	serialize      func(entry Entry) []byte
	deserialize    func(data []byte) Entry
}

func NewDBRepo[Entry DBEntry](
	collectionName string,
	serialize func(entry Entry) []byte,
	deserialize func(data []byte) Entry,
) *DBRepo[Entry] {
	memCache := utils.NewMemCache[Entry]()
	storage := NewDBStorage(collectionName)
	items := storage.ReadAll()
	for _, item := range items {
		entry := deserialize(item)
		memCache.SetOne(entry)
	}
	return &DBRepo[Entry]{
		mu:             sync.Mutex{},
		CollectionName: collectionName,
		Storage:        &storage,
		Cache:          memCache,
		serialize:      serialize,
		deserialize:    deserialize,
	}
}

func (repo *DBRepo[Entry]) FindAll() []Entry {
	return *repo.Cache.All()
}

func (repo *DBRepo[Entry]) Find(query utils.MemCacheQuery[Entry]) utils.Option[Entry] {
	return repo.Cache.Find(query)
}

func (repo *DBRepo[Entry]) FindById(id string) utils.Option[Entry] {
	return repo.Cache.FindById(id)
}

func (repo *DBRepo[Entry]) FindMany(query utils.MemCacheQuery[Entry]) []Entry {
	return repo.Cache.FindMany(query)
}

func (repo *DBRepo[Entry]) FindManyByIds(ids []string) []Entry {
	return repo.Cache.FindManyByIds(ids)
}

func (repo *DBRepo[Entry]) Set(entry Entry, write bool) Entry {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	entry.SetUpdatedAt(uint64(time.Now().Unix()))
	entries := []Entry{entry}
	repo.Cache.Set(entries)
	if write {
		repo.Storage.Write(entry.GetId(), repo.serialize(entry))
	}
	return entry
}

func (repo *DBRepo[Entry]) Save(id string) utils.Option[Entry] {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	item := repo.FindById(id)
	if !item.Available {
		return utils.None[Entry]()
	}
	repo.Storage.Write(item.Value.GetId(), repo.serialize(item.Value))
	return utils.Some(item.Value)
}

func (repo *DBRepo[Entry]) SetMany(entries []Entry) {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	repo.Cache.Set(entries)
	for _, entry := range entries {
		repo.Storage.Write(entry.GetId(), repo.serialize(entry))
	}
}

func (repo *DBRepo[Entry]) RemoveOne(id string) {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	repo.Cache.RemoveOne(id)
	repo.Storage.Remove(id)
}

func (repo *DBRepo[Entry]) RemoveMany(query utils.MemCacheQuery[Entry]) {
	repo.mu.Lock()
	defer repo.mu.Unlock()
	entries := repo.Cache.FindMany(query)
	for _, entry := range entries {
		repo.Storage.Remove(entry.GetId())
	}
	repo.Cache.RemoveMany(query)
}

type DefaultSerializeInput[P proto.Message] interface {
	ToProto() P
}

func DefaultSerialize[P proto.Message, I DefaultSerializeInput[P]]() func(input I) []byte {
	return func(input I) []byte {
		bytes, err := utils.PackProto(input.ToProto())
		if err != nil {
			panic(err)
		}
		return bytes
	}
}

func DefaultDeserialize[P proto.Message, O any](
	fromProto func(input P) O,
) func(bytes []byte) O {
	return func(bytes []byte) O {
		item, err := utils.UnpackProto[P](bytes)
		if err != nil {
			panic(err)
		}
		return fromProto(item)
	}
}
