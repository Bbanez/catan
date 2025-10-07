package appstate

import (
	"github.com/bbanez/catan/src/account"
	"github.com/bbanez/catan/src/settings"
	"github.com/bbanez/catan/src/storage"
)

type AppState struct {
	AccountRepo  *account.AccountRepo
	SettingsRepo *settings.SettingsRepo
	Storage      *storage.Storage
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
		UseServer:    false,
	}
}
