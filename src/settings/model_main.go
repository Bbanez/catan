package settings

import (
	"time"

	pb "github.com/bbanez/catan/gen/proto_settings"
	"github.com/nrednav/cuid2"
)

type Settings struct {
	Id          string
	CreatedAt   uint64
	UpdatedAt   uint64
	RenderWidth uint32
	UseServer   bool
}

func New(width uint32) *Settings {
	return &Settings{
		Id:          cuid2.Generate(),
		CreatedAt:   uint64(time.Now().Unix()),
		UpdatedAt:   uint64(time.Now().Unix()),
		RenderWidth: width,
		UseServer:   false,
	}
}

func (settings *Settings) GetId() string {
	return settings.Id
}
func (settings *Settings) SetId(id string) {
	settings.Id = id
}
func (settings *Settings) GetCreatedAt() uint64 {
	return settings.CreatedAt
}
func (settings *Settings) SetCreatedAt(create_at uint64) {
	settings.CreatedAt = create_at
}
func (settings *Settings) GetUpdatedAt() uint64 {
	return settings.UpdatedAt
}
func (settings *Settings) SetUpdatedAt(update_at uint64) {
	settings.UpdatedAt = update_at
}

func (settings *Settings) ToProto() *pb.Settings {
	return &pb.Settings{
		Id:          settings.Id,
		CreatedAt:   settings.CreatedAt,
		UpdatedAt:   settings.UpdatedAt,
		RenderWidth: settings.RenderWidth,
		UseServer:   settings.UseServer,
	}
}
func ToProto(settings *Settings) *pb.Settings {
	return settings.ToProto()
}

func FromProto(data *pb.Settings) *Settings {
	return &Settings{
		Id:          data.Id,
		CreatedAt:   data.CreatedAt,
		UpdatedAt:   data.UpdatedAt,
		RenderWidth: data.RenderWidth,
		UseServer:   data.UseServer,
	}
}
