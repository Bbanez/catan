package account

import (
	pb "github.com/bbanez/catan/gen/proto_account"
	db "github.com/bbanez/catan/src/db"
	"github.com/bbanez/catan/src/utils"
)

type AccountRepo struct {
	*db.DBRepo[*Account]
}

func NewRepo() *AccountRepo {
	return &AccountRepo{
		db.NewDBRepo(
			"accounts",
			db.DefaultSerialize[*pb.Account, *Account](),
			db.DefaultDeserialize(FromProto),
		),
	}
}

func (repo *AccountRepo) FindByUsername(username string) utils.Option[*Account] {
	res := repo.Find(func(item *Account) bool {
		return item.Username == username
	})
	return res
}
