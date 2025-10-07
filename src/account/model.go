package account

import (
	"time"

	pb "github.com/bbanez/catan/gen/proto_account"
	"github.com/nrednav/cuid2"
	"google.golang.org/protobuf/proto"
)

type Account struct {
	Id        string
	CreatedAt uint64
	UpdatedAt uint64
	Username  string
	Active    bool
}

func (account *Account) SetId(id string) {
	account.Id = id
}
func (account *Account) GetId() string {
	return account.Id
}
func (account *Account) SetCreatedAt(create_at uint64) {
	account.CreatedAt = create_at
}
func (account *Account) GetCreatedAt() uint64 {
	return account.CreatedAt
}
func (account *Account) SetUpdatedAt(update_at uint64) {
	account.UpdatedAt = update_at
}
func (account *Account) GetUpdatedAt() uint64 {
	return account.UpdatedAt
}

func New(username string, active bool) *Account {
	return &Account{
		Id:        cuid2.Generate(),
		CreatedAt: uint64(time.Now().Unix()),
		UpdatedAt: uint64(time.Now().Unix()),
		Username:  username,
		Active:    active,
	}
}

func ToProto(account *Account) *pb.Account {
	return &pb.Account{
		Id:        account.Id,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
		Username:  account.Username,
		Active:    account.Active,
	}
}

func (account *Account) ToProto() *pb.Account {
	return ToProto(account)
}

func FromProto(account *pb.Account) *Account {
	return &Account{
		Id:        account.Id,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
		Username:  account.Username,
		Active:    account.Active,
	}
}

func Deserialize(data []byte) (*Account, error) {
	account := pb.Account{}
	err := proto.Unmarshal(data, &account)
	if err != nil {
		return nil, err
	}
	return FromProto(&account), nil
}

func Serialize(account *Account) []byte {
	prot := account.ToProto()
	b, err := proto.Marshal(prot)
	if err != nil {
		panic(err)
	}
	return b
}

func (account *Account) Serialize() []byte {
	return Serialize(account)
}
