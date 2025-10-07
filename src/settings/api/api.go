package settings_api

import (
	"fmt"

	pb "github.com/bbanez/catan/gen/proto_settings"
	appstate "github.com/bbanez/catan/src/app_state"
	st "github.com/bbanez/catan/src/settings"
	"github.com/bbanez/catan/src/srv"
	"github.com/bbanez/catan/src/utils"
)

type Api struct {
}

func New() *Api {
	return &Api{}
}

func (_api *Api) SettingsGet(message utils.IpcMessage) utils.IpcMessage {
	data, err := utils.UnpackIpcMessage[*pb.SettingsSet](&message)
	if err != nil {
		return *err
	}
	state := appstate.Get()
	settings := state.SettingsRepo.FindAll()
	var setting *st.Settings
	if len(settings) > 0 {
		setting = settings[0]
	} else {
		setting = state.SettingsRepo.Set(st.New(data.RenderWidth), true)
	}
	setting.UseServer = state.UseServer
	return utils.NewIpcMessageFromProto(false, setting.ToProto())
}

func (_api *Api) SettingsSet(message utils.IpcMessage) utils.IpcMessage {
	data, err := utils.UnpackIpcMessage[*pb.SettingsSet](&message)
	if err != nil {
		return *err
	}
	state := appstate.Get()
	settings := state.SettingsRepo.FindAll()
	var setting *st.Settings
	if len(settings) > 0 {
		setting = settings[0]
		setting.RenderWidth = data.RenderWidth
		setting.UseServer = data.UseServer
	} else {
		setting = st.New(data.RenderWidth)
		setting.UseServer = data.UseServer
	}
	if setting.UseServer {
		fmt.Println("Starting server")
		if !srv.IsRunning() {
			srv.Start()
		}
	} else {
		fmt.Println("Stopping server")
		srv.Stop()
	}
	state.UseServer = setting.UseServer
	state.SettingsRepo.Set(setting, true)
	return utils.NewIpcMessageFromProto(false, setting.ToProto())
}
