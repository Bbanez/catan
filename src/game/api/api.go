package game_api

import (
	pb "github.com/bbanez/catan/gen/proto_game"
	"github.com/bbanez/catan/src/account"
	appstate "github.com/bbanez/catan/src/app_state"
	"github.com/bbanez/catan/src/game"
	"github.com/bbanez/catan/src/utils"
)

type Api struct{}

func New() *Api {
	return &Api{}
}

func (_api *Api) GameCreate() utils.IpcMessage {
	state := appstate.Get()
	acc := state.AccountRepo.Find(func(item *account.Account) bool {
		return item.Active
	})
	if !acc.Available {
		acc.Value = state.AccountRepo.Set(
			account.New("host", true),
			true,
		)
	}
	state.Game = utils.Some(game.New(acc.Value))
	return utils.NewIpcMessageFromProto(false, state.Game.Value.ToProto())
}

func (_api *Api) GameGet(message utils.IpcMessage) utils.IpcMessage {
	_, err := utils.UnpackIpcMessage[*pb.GameGetRequest](&message)
	if err != nil {
		return *err
	}
	state := appstate.Get()
	return utils.NewIpcMessageFromProto(false, state.Game.Value.ToProto())
}
