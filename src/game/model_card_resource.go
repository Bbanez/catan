package game

import (
	pb "github.com/bbanez/catan/gen/proto_game"
)

type GameCardResource struct {
	Type   pb.GameCardResourceType
	Amount uint32
}

func GameCardResourceNew(resourceType pb.GameCardResourceType) *GameCardResource {
	return &GameCardResource{
		Type:   resourceType,
		Amount: 1,
	}
}

func GameCardResourceFromProto(resource *pb.GameCardResource) *GameCardResource {
	return &GameCardResource{
		Type:   resource.Type,
		Amount: resource.Amount,
	}
}

func (r *GameCardResource) ToProto() *pb.GameCardResource {
	return &pb.GameCardResource{
		Type:   r.Type,
		Amount: r.Amount,
	}
}
func GameCardResourceToProto(resource *GameCardResource) *pb.GameCardResource {
	return resource.ToProto()
}
