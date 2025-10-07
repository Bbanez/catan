package settings

import (
	pb "github.com/bbanez/catan/gen/proto_settings"
	"github.com/bbanez/catan/src/db"
)

type SettingsRepo struct {
	*db.DBRepo[*Settings]
}

func NewRepo() *SettingsRepo {
	return &SettingsRepo{
		db.NewDBRepo(
			"settings",
			db.DefaultSerialize[*pb.Settings, *Settings](),
			db.DefaultDeserialize(FromProto),
		),
	}
}
