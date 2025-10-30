package appstate

import (
	"github.com/bbanez/catan/src/account"
	"github.com/bbanez/catan/src/game"
	"github.com/bbanez/catan/src/settings"
	"github.com/bbanez/catan/src/storage"
	"github.com/bbanez/catan/src/utils"
)

type AppState struct {
	AccountRepo  *account.AccountRepo
	SettingsRepo *settings.SettingsRepo
	Storage      *storage.Storage
	Game         utils.Option[*game.Game]
	UseServer    bool
}

var appState *AppState

func Get() *AppState {
	return appState
}

func Init() {
	appState = &AppState{
		AccountRepo:  account.NewRepo(),
		SettingsRepo: settings.NewRepo(),
		Storage:      storage.New(),
		Game:         utils.None[*game.Game](),
		UseServer:    false,
	}
}
