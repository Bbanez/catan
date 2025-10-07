package utils

import (
	"sync"
)

type MemCacheItem interface {
	GetId() string
}

type MemCacheQuery[Item MemCacheItem] func(item Item) bool

type MemCache[Item MemCacheItem] struct {
	lock  sync.Mutex
	items *[]Item
}

func NewMemCache[Item MemCacheItem]() *MemCache[Item] {
	return &MemCache[Item]{
		lock:  sync.Mutex{},
		items: &[]Item{},
	}
}

func (mc *MemCache[Item]) All() *[]Item {
	return mc.items
}

func (mc *MemCache[Item]) Find(query MemCacheQuery[Item]) Option[Item] {
	for _, item := range *mc.items {
		if query(item) {
			return Some(item)
		}
	}
	return None[Item]()
}

func (mc *MemCache[Item]) FindById(id string) Option[Item] {
	return mc.Find(func(item Item) bool {
		return item.GetId() == id
	})
}

func (mc *MemCache[Item]) FindMany(query MemCacheQuery[Item]) []Item {
	var result []Item
	for _, item := range *mc.items {
		if query(item) {
			result = append(result, item)
		}
	}
	return result
}

func (mc *MemCache[Item]) FindManyByIds(ids []string) []Item {
	var result []Item
	for _, item := range *mc.items {
		for _, id := range ids {
			if item.GetId() == id {
				result = append(result, item)
			}
		}
	}
	return result
}

func (mc *MemCache[Item]) SetOne(item Item) {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	var found = false
	for i, it := range *mc.items {
		if it.GetId() == item.GetId() {
			(*mc.items)[i] = item
			found = true
			break
		}
	}
	if !found {
		*mc.items = append(*mc.items, item)
	}
}

func (mc *MemCache[Item]) Set(items []Item) {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	for _, item := range items {
		var found_idx int = -1
		for i, it := range *mc.items {
			if it.GetId() == item.GetId() {
				found_idx = i
				break
			}
		}
		if found_idx != -1 {
			(*mc.items)[found_idx] = item
			break
		} else {
			*mc.items = append(*mc.items, item)
		}
	}
}

func (mc *MemCache[Item]) RemoveOne(id string) {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	for i, it := range *mc.items {
		if it.GetId() == id {
			*mc.items = append((*mc.items)[:i], (*mc.items)[i+1:]...)
			break
		}
	}
}

func (mc *MemCache[Item]) Remove(ids []string) {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	for i, it := range *mc.items {
		for _, id := range ids {
			if it.GetId() == id {
				*mc.items = append((*mc.items)[:i], (*mc.items)[i+1:]...)
				break
			}
		}
	}
}

func (mc *MemCache[Item]) RemoveMany(query MemCacheQuery[Item]) {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	var to_remove []Item
	for i, item := range *mc.items {
		if query(item) {
			*mc.items = append((*mc.items)[:i], (*mc.items)[i+1:]...)
		}
	}
	*mc.items = append((*mc.items)[:0], (*mc.items)[0:]...)
	*mc.items = append(*mc.items, to_remove...)
}

func (mc *MemCache[Item]) Clear() {
	mc.lock.Lock()
	defer mc.lock.Unlock()
	mc.items = &[]Item{}
}
